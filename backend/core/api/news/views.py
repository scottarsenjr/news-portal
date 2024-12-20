from rest_framework.viewsets import ModelViewSet
from .serializers import NewsSerializer
from .models import News


class NewsViewset(ModelViewSet):
    serializer_class = NewsSerializer
    queryset = News.objects.all().order_by('-created_at')
