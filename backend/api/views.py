from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import F
from .models import User, Tag, Question, Answer, Comment, Vote, Diploma
from .serializers import (
    UserSerializer, TagSerializer, QuestionSerializer, 
    QuestionDetailSerializer, AnswerSerializer, CommentSerializer, 
    DiplomaSerializer, RegisterSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class AuthViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('-created_at')
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags__name']
    ordering_fields = ['created_at', 'votes']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return QuestionDetailSerializer
        return QuestionSerializer

    def perform_create(self, serializer):
        # Récupération des noms de tags depuis la requête
        tags_data = self.request.data.get('tags', [])
        question = serializer.save(author=self.request.user)
        
        if isinstance(tags_data, list):
            from django.utils.text import slugify
            for tag_name in tags_data:
                tag_name = tag_name.strip()
                if tag_name:
                    # On cherche ou on crée le tag par son nom
                    tag, created = Tag.objects.get_or_create(
                        name=tag_name,
                        defaults={'slug': slugify(tag_name)}
                    )
                    question.tags.add(tag)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def vote(self, request, pk=None):
        question = self.get_object()
        user = request.user
        value = int(request.data.get('value', 0))
        
        if value not in [1, -1]:
            return Response({'error': 'Invalid vote value'}, status=status.HTTP_400_BAD_REQUEST)

        from django.db import transaction
        with transaction.atomic():
            vote, created = Vote.objects.get_or_create(
                user=user, question=question,
                defaults={'value': value}
            )

            if not created:
                if vote.value == value:
                    # User clicked same vote again: remove vote (toggle)
                    question.votes = F('votes') - value
                    vote.delete()
                else:
                    # Change vote (e.g. up to down)
                    old_value = vote.value
                    question.votes = F('votes') - old_value + value
                    vote.value = value
                    vote.save()
            else:
                # New vote
                question.votes = F('votes') + value
            
            question.save()
            
        question.refresh_from_db()
        return Response({'votes': question.votes})

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_best(self, request, pk=None):
        answer = self.get_object()
        if answer.question.author != request.user:
            return Response({'error': 'Only question author can mark best answer'}, status=status.HTTP_403_FORBIDDEN)
        
        # Unmark previous best answers for this question
        Answer.objects.filter(question=answer.question, is_best_answer=True).update(is_best_answer=False)
        
        answer.is_best_answer = True
        answer.save()
        return Response({'status': 'marked as best'})

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class DiplomaViewSet(viewsets.ModelViewSet):
    queryset = Diploma.objects.all()
    serializer_class = DiplomaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['retrieve', 'list']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['get'], url_path='verify')
    def verify(self, request, pk=None):
        # Allow anyone to verify by serial number or ID
        diploma = get_object_or_404(Diploma, serial_number=pk)
        serializer = self.get_serializer(diploma)
        return Response(serializer.data)
