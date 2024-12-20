from django.urls import include, path

urlpatterns = [
    path('v1/authentication/', include('core.api.authentication.urls'), name='authentication'),
    path('v1/news/', include('core.api.news.urls'), name='news'),
]
