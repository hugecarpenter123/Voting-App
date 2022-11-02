from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('polls/<int:pk>', views.polls, name="polls"),

    path('vote-update/<int:pk>', views.vote_update, name='vote-update'),
]
