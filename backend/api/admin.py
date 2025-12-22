from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Tag, Question, Answer, Comment, Vote, Diploma

# Custom User Admin
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'date_joined', 'avatar_preview')
    list_filter = ('role', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informations Additionnelles', {'fields': ('role', 'avatar', 'bio')}),
    )
    
    def avatar_preview(self, obj):
        if obj.avatar:
            return format_html('<img src="{}" width="40" height="40" style="border-radius: 50%;" />', obj.avatar.url)
        return '—'
    avatar_preview.short_description = 'Avatar'

# Tag Admin
@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'question_count')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    
    def question_count(self, obj):
        return obj.questions.count()
    question_count.short_description = 'Questions'

# Question Admin
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'votes', 'answer_count', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at', 'tags')
    search_fields = ('title', 'description', 'author__username')
    date_hierarchy = 'created_at'
    filter_horizontal = ('tags',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Question', {
            'fields': ('author', 'title', 'description', 'tags')
        }),
        ('Statistiques', {
            'fields': ('votes', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def answer_count(self, obj):
        count = obj.answers.count()
        if count > 0:
            return format_html('<span style="color: green; font-weight: bold;">{}</span>', count)
        return format_html('<span style="color: gray;">0</span>')
    answer_count.short_description = 'Réponses'

# Answer Admin
@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('question_preview', 'author', 'votes', 'is_best_answer', 'created_at')
    list_filter = ('is_best_answer', 'created_at', 'updated_at')
    search_fields = ('content', 'author__username', 'question__title')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Réponse', {
            'fields': ('author', 'question', 'content', 'is_best_answer')
        }),
        ('Statistiques', {
            'fields': ('votes', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def question_preview(self, obj):
        return obj.question.title[:50] + '...' if len(obj.question.title) > 50 else obj.question.title
    question_preview.short_description = 'Question'

# Comment Admin
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'content_preview', 'target', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'author__username')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Contenu'
    
    def target(self, obj):
        if obj.question:
            return format_html('Question: <b>{}</b>', obj.question.title[:30])
        elif obj.answer:
            return format_html('Réponse à: <b>{}</b>', obj.answer.question.title[:30])
        return '—'
    target.short_description = 'Cible'

# Vote Admin
@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'vote_type', 'target', 'value')
    list_filter = ('value',)
    search_fields = ('user__username',)
    
    def vote_type(self, obj):
        if obj.value == 1:
            return format_html('<span style="color: green;">▲ Upvote</span>')
        return format_html('<span style="color: red;">▼ Downvote</span>')
    vote_type.short_description = 'Type'
    
    def target(self, obj):
        if obj.question:
            return format_html('Question: {}', obj.question.title[:30])
        elif obj.answer:
            return format_html('Réponse à: {}', obj.answer.question.title[:30])
        return '—'
    target.short_description = 'Cible'

# Diploma Admin
@admin.register(Diploma)
class DiplomaAdmin(admin.ModelAdmin):
    list_display = ('serial_number', 'student_name', 'student_id', 'degree_name', 'graduation_date', 'is_signed', 'qr_preview')
    list_filter = ('is_signed', 'graduation_date', 'issue_date')
    search_fields = ('student_name', 'student_id', 'serial_number', 'degree_name')
    date_hierarchy = 'graduation_date'
    readonly_fields = ('serial_number', 'issue_date', 'signature_data', 'qr_code_preview')
    
    fieldsets = (
        ('Informations Étudiant', {
            'fields': ('student_name', 'student_id')
        }),
        ('Informations Diplôme', {
            'fields': ('degree_name', 'major', 'graduation_date')
        }),
        ('Certification', {
            'fields': ('serial_number', 'is_signed', 'signature_data', 'issue_date'),
            'classes': ('collapse',)
        }),
        ('QR Code', {
            'fields': ('qr_code', 'qr_code_preview'),
            'classes': ('collapse',)
        }),
    )
    
    def qr_preview(self, obj):
        if obj.qr_code:
            return format_html('<img src="{}" width="50" height="50" />', obj.qr_code.url)
        return '—'
    qr_preview.short_description = 'QR'
    
    def qr_code_preview(self, obj):
        if obj.qr_code:
            return format_html('<img src="{}" width="200" height="200" />', obj.qr_code.url)
        return 'Aucun QR code généré'
    qr_code_preview.short_description = 'Aperçu QR Code'

# Customize admin site
admin.site.site_header = "Stack Overflow - Administration"
admin.site.site_title = "Stack Overflow Admin"
admin.site.index_title = "Gestion de la plateforme"

