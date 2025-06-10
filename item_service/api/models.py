import mongoengine as me

class Counter(me.Document):
    name = me.StringField(required=True, unique=True)
    value = me.IntField(default=0)

    @classmethod
    def get_next_value(cls, Counter_name):
        counter = cls.objects(name=Counter_name).modify(upsert = True, new=True, inc__value=1)
        return counter.value
    
class Item(me.Document):
    item_id = me.IntField(unique=True,default = lambda: Counter.get_next_value('item_id'))
    name = me.StringField(required=True, max_length=100)
    description = me.StringField(required=True, max_length=500)
    price = me.IntField(required=True)
    meta = {
        'collection': 'items',
        'indexes': ['item_id']
    }