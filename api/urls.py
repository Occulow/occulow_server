from django.conf.urls import url

from . import views

app_name = 'api'
urlpatterns = [
    url(r'^sensors', views.list_sensors, name="list_sensors")
]