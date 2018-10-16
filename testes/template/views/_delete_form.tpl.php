<button-delete-list 
action="{{ path('>>entity<<_delete', {'>>entity<<': >>entity<<.>>key<<}) }}"
csrf="{{ csrf_token('delete' ~ >>entity<<.>>key<<) }}"
></button-delete-list>