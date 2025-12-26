from rest_framework import serializers
from .models import User, Tag, Question, Answer, Comment, Vote, Diploma

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'avatar', 'bio')
        read_only_fields = ('id',)

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    
    class Meta:
        model = Comment
        fields = ('id', 'author', 'author_name', 'question', 'answer', 'content', 'created_at')
        read_only_fields = ('id', 'author', 'created_at')

class AnswerSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Answer
        fields = ('id', 'author', 'author_name', 'question', 'content', 'created_at', 'updated_at', 'votes', 'is_best_answer', 'comments')
        read_only_fields = ('id', 'author', 'created_at', 'updated_at', 'votes')

    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all(), required=False)
    
    class Meta:
        model = Question
        fields = ('id', 'author', 'author_name', 'title', 'description', 'tags', 'tags_detail', 'created_at', 'updated_at', 'votes', 'answers_count')
        read_only_fields = ('id', 'author', 'created_at', 'updated_at', 'votes')

    def get_answers_count(self, obj):
        return obj.answers.count()

class QuestionDetailSerializer(QuestionSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta(QuestionSerializer.Meta):
        fields = QuestionSerializer.Meta.fields + ('answers', 'comments')

class DiplomaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diploma
        fields = '__all__'
        read_only_fields = ('id', 'issue_date', 'qr_code')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
