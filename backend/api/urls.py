from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    UserViewSet, AuthViewSet, TagViewSet, QuestionViewSet, 
    AnswerViewSet, CommentViewSet, DiplomaViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'tags', TagViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'answers', AnswerViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'diplomas', DiplomaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', AuthViewSet.as_view({'post': 'register'}), name='auth-register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
