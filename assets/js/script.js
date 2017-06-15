jQuery(document).ready(function () {

    $("a[href='#']").on("click", function (e) {
        e.preventDefault();
    });

    var html = "";

    $.getJSON("data.json", function (data) {

            $.each(data.contents, function (keyCompanies, company) {
                //company.Id
                //company.Company
                $.each(company.Courses, function (keyCourses, course) {
                    //course.Id
                    //course.Status
                    //course.Name
                    //course.Quantity
                    //course.Description
                    if (course.Status == "Active") {

                        html += '<tr>';
                        html += '<td>' + company.Company + '</td>';
                        html += '<td align="center">' + course.Name + '</td>';
                        html += '<td align="center">' + course.Quantity + '</td>';
                        html += '<td align="center"><a href="javascript:void(0)" data-description="' + course.Description + '" onclick="abrirModalDescricaoCurso(this);">Ver Descrição</a></td>';
                        html += '</tr>';
                    }
                });

            });

        }).done(function () {

            $("#dataTables tbody").html(html);
            $('#dataTables').DataTable({
                responsive: true,
                language: {
                    url: 'dataTables.Portuguese-Brasil.json'
                },
                order: [
                    [0, 'asc'],
                    [1, 'asc']
                ]
            });

        })
        .fail(function () {
            $("#dataTables tbody tr").html('<td colspan="4" align="center">Desculpe, houve algum problema na listagem dos cursos!</td>');
        });

});

var abrirModalDescricaoCurso = function (el) {

    var description = $(el).attr("data-description");

    $('#modalDescricaoCurso .description').text(description);
    $('#modalDescricaoCurso').modal();
}