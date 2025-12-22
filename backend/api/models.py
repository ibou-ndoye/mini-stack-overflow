from django.contrib.auth.models import AbstractUser
from django.db import models
import qrcode
from io import BytesIO
from django.core.files import File
import uuid
import hashlib
from decouple import config

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Administrateur'),
        ('STUDENT', 'Étudiant'),
        ('TEACHER', 'Enseignant'),
        ('STAFF', 'Personnel Scolarité'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STUDENT')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Question(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='questions')
    title = models.CharField(max_length=255)
    description = models.TextField() # Markdown content
    tags = models.ManyToManyField(Tag, related_name='questions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class Answer(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    content = models.TextField() # Markdown content
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    votes = models.IntegerField(default=0)
    is_best_answer = models.BooleanField(default=False)

    def __str__(self):
        return f"Answer to {self.question.title} by {self.author.username}"

class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author.username}"

class Vote(models.Model):
    VOTE_TYPES = (
        (1, 'Upvote'),
        (-1, 'Downvote'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True, blank=True)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, null=True, blank=True)
    value = models.SmallIntegerField(choices=VOTE_TYPES)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'question'], name='unique_user_question_vote', condition=models.Q(answer__isnull=True)),
            models.UniqueConstraint(fields=['user', 'answer'], name='unique_user_answer_vote', condition=models.Q(question__isnull=True)),
        ]

class Diploma(models.Model):
    student_name = models.CharField(max_length=255)
    student_id = models.CharField(max_length=50, unique=True)
    degree_name = models.CharField(max_length=255)
    major = models.CharField(max_length=255)
    graduation_date = models.DateField()
    issue_date = models.DateField(auto_now_add=True)
    serial_number = models.CharField(max_length=100, unique=True)
    qr_code = models.ImageField(upload_to='qrcodes/', null=True, blank=True)
    is_signed = models.BooleanField(default=False)
    signature_data = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Diploma {self.serial_number} - {self.student_name}"

    def save(self, *args, **kwargs):
        if not self.serial_number:
            self.serial_number = f"DIP-{uuid.uuid4().hex[:8].upper()}"
        
        if not self.qr_code:
            qr_content = f"https://uasz.sn/verify/{self.serial_number}"
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(qr_content)
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white")
            buffer = BytesIO()
            img.save(buffer, format='PNG')
            filename = f"qr-{self.serial_number}.png"
            self.qr_code.save(filename, File(buffer), save=False)
            
        if self.is_signed and not self.signature_data:
            data_to_sign = f"{self.serial_number}|{self.student_id}|{self.graduation_date}"
            secret = config('SECRET_KEY')
            self.signature_data = hashlib.sha256(f"{data_to_sign}{secret}".encode()).hexdigest()

        super().save(*args, **kwargs)
