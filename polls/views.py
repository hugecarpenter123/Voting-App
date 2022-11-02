from django.shortcuts import render
from django.http import HttpResponse
from .models import Question, Choice

from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ChoiceSerializer, QuestionSerializer

# Create your views here.

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
    print("vote_update function ---------------")
    choice = Choice.objects.get(id=pk)
    choice.votes += 1
    print('choice votes =', choice.votes)
    choice.save()
    serializer = ChoiceSerializer(instance=choice)
    print("vote_update end --------------------")
    return Response(serializer.data)

@api_view(['GET'])
def vote_detail(request, pk):
    print("vote_detail function ---------------")

    question = Question.objects.get(id=pk)
    vote_data = [{choice.choice_text: choice.votes} for choice in question.choice_set.all()]
    serializer = QuestionSerializer(instance=question, many=False)
    print("VOTE DATA:\n", vote_data)
    print("vote_detail end --------------------")
    return JsonResponse(vote_data, safe=False)