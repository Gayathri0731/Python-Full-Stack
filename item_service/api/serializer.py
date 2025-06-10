from rest_framework import serializers
from .models import Item
class ItemSerializer(serializers.Serializer):
    item_id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=100)
    price = serializers.IntegerField() 

    def create(self, validated_data):
        """
        Create and return a new `Item` instance, given the validated data.
        """
        return Item(**validated_data).save()

    def update(self, instance, validated_data):
        """
        Update and return an existing `Item` instance, given the validated data.
        """
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance   