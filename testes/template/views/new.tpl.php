{% block body %}
    <h1>Criar >> title <<</h1>

    <button-back-list path="{{ path('>>entity<<_index') }}"></button-back-list>

    {{ include('>>entity<</_form.html.twig') }}
{% endblock %}


