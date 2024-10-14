
$(document).ready(function(){
    const filmsUrl = 'http://localhost:3000/films';
    let currentFilmId;
// function to fetch films and load them into the list
function loadFilms(){
    $.get(filmsUrl)
      .done((films) =>{
        $('#films').empty();
        films.forEach(film=>{
            const availableTickets=film.capscity - film.Tickets_sold;
            const filmItem = $(`
                <li class="film item" data-id="${film.id}">
                ${film.title}
                <button class="ui red button delete-btn" style="float:right;">Delete</button>
                </li>
                `);
            if (availableTickets === 0){
                filmItem.addClass('sold-out');
            }
            $('#films').append(filmItem);        
        });
        loadFilmDetails(films[0]); // load details for the first film
      });
}
}
    // function to load details of a selected film 
    function loadFilmDetails(film){
        const availableTickets = film.capacity - film.tickets_sold;
        $('#title').text (film.title);
        $('#runtime').text (`${film.runtime} minutes`);
        $('#film-info').text (film.description);
        $('#showtime').text (film.showtime);
        $('#poster').attr('src',film.poster);
        $('#ticket-num').text (availableTickets);
        $('#buy-ticket').prop ('disabled', availableTickets=== 0);
        $('#delete-film').show();
        currentFilmId = film.id;
    }
    // Load the films on page load 
    loadFilms ();
    // handle film selection 
    $('#films').on('click','.film.item', function () {
        const filmId = $(this).data('id');
        $.get(`${filmsUrl}/${filmId}`).done(loadFilmDetails);
    }
    // buy ticket functionality
    $('#buy-ticket').click(function(){
        const filmId = currentFilmId;
        $.get(`${filmsUrl}/${filmId}`)
          .done ((film)=>{
            const updateTicketsSold = film.tickets_sold + 1;
            if (updateTicketsSold<= film.capacity){
                $.ajax({
                    url:`${filmsUrl}/${filmId}`,
                    type: 'PATCH',
                    contentType: 'application/json',
                    data: JSON.stringify({tickets_sold:updatedTicketsSold}),
                }).done (()=>{
                    const newTicketsAvailable = film.capacity - updatedTicketsSold;
                    $('#ticket-num').text(newTicketsAvaialble);
                })
            }
          })
    })
    // delete film functionality
    $('#films').on('click','.delete-btn', function(){
        const filmId = $(this).closest('.film.item').data('id');
        $.ajax({
            url:`${filmUrl}/${filmId}`,
            type: 'DELETE',
        }).done(()=>{
            $(this).closest('.film.item').remove();
            if (currentFilmId === filmId){
                $('#showing').hide();// hide showing info if the deleted film was selected
            }
        })
        })
    ));
 
