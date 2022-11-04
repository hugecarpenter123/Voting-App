from django.shortcuts import render
from .models import Question, Choice

from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ChoiceSerializer, QuestionSerializer

def index(request):
    question_objects = Question.objects.all()
    context = {
        'question_objects': question_objects,
    }
    return render(request, 'polls/index.html', context)

def polls(request, pk):
    question_objects = Question.objects.all()
    size = len(question_objects)

    context = {
        'question_objects': question_objects,
        'question_object': question_objects.get(pk=pk),
        'pk': pk,
        'prev': pk - 1 if pk - 1 != 0 else size,
        'next': pk + 1 if pk + 1 <= size else 1
    }
    return render(request, 'polls/list.html', context)

@api_view(['POST'])
def vote_update(request, pk):
    choice = Choice.objects.get(id=pk)
    choice.votes += 1
    choice.save()
    serializer = ChoiceSerializer(instance=choice)
    return Response(serializer.data)

@api_view(['GET'])
def vote_detail(request, pk):
    question = Question.objects.get(id=pk)
    vote_data = [{choice.choice_text: choice.votes} for choice in question.choice_set.all()]
    serializer = QuestionSerializer(instance=question, many=False)
    return JsonResponse(vote_data, safe=False)