{% block body %}
    <h1>Editar >>entity<<</h1>

    <button-back-list path="{{ path('>>entity<<_index') }}"></button-back-list>

    {{ include('>>entity<</_form.html.twig') }}
{% endblock %}