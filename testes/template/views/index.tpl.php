{% block body %}
<h1> >>entity<< </h1>

    {% for message in app.flashes('success') %}
        <alert-form message="{{message}}" type="success"></alert-form>
    {% endfor %}

    <button-new path="{{ path('>>entity<<_new') }}"></button-new>

    <table class="table my-3">
        <thead>
            <tr>
                >>#symfony-entity-props<<
                <th> >>.<< </th>
                >>/symfony-entity-props<<
                <th> Ações </th>
            </tr>
        </thead>
        <tbody>
        {% for >>s:class_lower<< in pagination %}
            <tr>
                >>#symfony-entity-get-entity-print-codes<<
                    <td> >>.<< </td>
                >>/symfony-entity-get-entity-print-codes<<
                <td>
                    <button-edit-list path="{{ path('>>entity<<_edit', {'>>entity<<': >>entity<<.>>key<<}) }}"></button-edit-list>
                    {{ include('>>key<</_delete_form.html.twig') }}
                </td>
            </tr>
        {% else %}
            <tr>
                <td colspan=">>symfony-entity-props-counter<<">Nenhum item encontrado</td>
            </tr>
        {% endfor %}
        </tbody>
    </table>

    {{ knp_pagination_render(pagination) }}
{% endblock %}