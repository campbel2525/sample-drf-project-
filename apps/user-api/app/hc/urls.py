from django.urls import path

from app.hc import views

urlpatterns = [
    path("", views.hc, name="hc"),
]
