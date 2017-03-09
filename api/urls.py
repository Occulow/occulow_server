from django.conf.urls import url
from django.http import HttpResponseNotAllowed

from . import views

# Dispatches to view based on HTTP method
def method_dispatch(**table):
    def invalid_method(request, *args, **kwargs):
        return HttpResponseNotAllowed(table.keys())

    def d(request, *args, **kwargs):
        handler = table.get(request.method, invalid_method)
        return handler(request, *args, **kwargs)
    return d


app_name = 'api'
urlpatterns = [
    url(r'^sensors/$', method_dispatch(GET=views.list_sensors,POST=views.add_sensor), name="sensors"),
    url(r'^sensors/(?P<id>[0-9]+)/$', method_dispatch(GET=views.get_sensor), name="get_sensor"),
]