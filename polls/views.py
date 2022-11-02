from django.shortcuts import render
from django.http import HttpResponse
from .models import Question, Choice

from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

def index(request):
    question_objects = Question.objects.all()
    context = {
        'question_objects': question_objects,
    }
    return render(request, 'polls/index.html', context)

def polls(request, pk):
    question_objects = Question.objects.all()

    context = {
        'question_objects': question_objects,
        'question_object': question_objects.get(pk=pk),
        'pk': pk,
    }
    return render(request, 'polls/list.html', context)
