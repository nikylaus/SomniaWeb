$(document).ready(function () {
    $.cookie("profilo", "");

    let idFilmDelete;

    //HOMEPAGE FILM+PAGINA FILM////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $('body',).on('mouseenter', ".content", function () {
        $(this).addClass('transition');
        $(this).css('z-index', 30);
    });
    $('body').on('mouseleave', ".content", function () {
        $(this).removeClass('transition');
        $(this).css('z-index', 1);
    });
    //popolazione film homepage
    let listaFilm = null;
    let listaFilmSala = [];
    (() => {
        $.get('http://localhost:8080/api/film', function (response) {
            $('#containerFilmSala').empty();
            listaFilm = response;
            if (location.pathname == '/index.html') {
                //let result = '<div class="row"><div class="col text-start"><h2>NUOVI ARRIVI</h2></div><div class="col-2 mb-2 form-outline form-white">   <input type="text" id="searchBar" class="form-control" />   <label class="form-label" for="searchBar">Cerca</label> <hr class="mt-0"> </div></div><div class="row mt-3">'
                let result = '<div class="row mt-3">'
                let counter = 0;
                let c = 0;
                for (let film of response) {
                    if (film.condizione == "sala") {
                        listaFilmSala[c] = film;
                        c++;
                        if (counter % 3 == 0) {
                            if (counter == 3) {
                                result += '<h2 class="mt-3 mb-4">DA NON PREDERE</h2>'
                            }
                            result += '</div><div class="row mt-5">';
                        }
                        result += '<div class="col-md"><div class="text-center"><a href="#"><img data-id="' + film.id + '" src="' + film.img + '"alt="" width="70%" class="content  contenitoreFilm"></a><div class="mt-4"><p class="titolo-film">' + film.nome + '</a><p class="genere">' + film.genere + '</p></div></div></div>'
                    }
                    counter++;
                }
                result += '</div>';
                $('#containerFilmSala').append(result);
                $('#surpriseThem').attr('data-id', listaFilmSala[Math.floor(Math.random() * listaFilmSala.length)].id);
            }

        })
    })();

    $('#guessTheMovie').click(function () {
        $('#modalGuessFilm').modal('show');
    })

    let filmGuess = [];
    $('body').on('click', '#btnStupiscimi', function () {
        filmGuess = [];
        let sangueVal = $('#sangueVal').val();
        let azioneVal = $('#azioneVal').val();
        let cadaveriVal = $('#cadaveriVal').val();
        let fantasyVal = $('#fantasyVal').val();
        let ridereVal = $('#ridereVal').val();
        let totale = parseInt(sangueVal) + parseInt(azioneVal) + parseInt(cadaveriVal) + parseInt(fantasyVal) - parseInt(ridereVal);
        let c = 0;
        if (totale < 6) {
            for (const i of listaFilmSala) {
                if (i.genere.toLowerCase() == "commedia") {
                    filmGuess[c] = i;
                    c++;
                }
            }
        } else if (totale > 5 & totale < 8) {
            for (const i of listaFilmSala) {
                if (i.genere.toLowerCase() == "drammatico") {
                    filmGuess[c] = i;
                    c++;
                }
            }
        } else if (totale > 7 & totale < 11) {
            for (const i of listaFilmSala) {
                if (i.genere.toLowerCase() == "fantasy") {
                    filmGuess[c] = i;
                    c++;
                }
            }
        } else if (totale > 10 & totale < 15) {
            for (const i of listaFilmSala) {
                if (i.genere.toLowerCase() == "azione") {
                    filmGuess[c] = i;
                    c++;
                }
            }
        } else if (totale > 14) {
            for (const i of listaFilmSala) {
                if (i.genere.toLowerCase() == "horror") {
                    filmGuess[c] = i;
                    c++;
                }
            }
        }
        appendGuess(filmGuess);
    });

    function appendGuess(films){
        let result = "";
        for (const i of films) {
            result += '<div class="row mt-3"><div class="col d-flex justify-content-center"> <div class="card content" data-id="'+i.id+'" style="width: 18rem;">   <img src="'+i.img+'" class="card-img-top" alt="Sunset Over the Sea"/>   <div class="card-body">     <p class="card-text">'+i.descrizione+'</p> </div> </div></div> </div>'
        }
        $('#modalGuessFilm').modal('hide');
        $('#contentStupiscimi').empty();
        $('#contentStupiscimi').append(result);
        $('#modalRisultatiGuessFilm').modal('show');
    }


    $('#searchBar').on('input', function () {
        let valore = $(this).val().toLowerCase();
        let trovati = [];
        let c = 0;
        for (const i of listaFilm) {
            if (i.nome.toLowerCase().includes(valore) & i.condizione == "sala") {
                trovati[c] = i;
                c++;
            }
        }
        console.log(trovati);
        if (trovati.length > 0) {
            inserisciRisultati(trovati);
        } else {
            $('#dropDownSearch').empty();
        }
    });

    $('body').on('click', function () {
        if (active) {
            $(".dropdown-menu").toggle();
            active = false;
        }
    })

    let active = false;
    function inserisciRisultati(array) {
        let finale = ''
        for (const i of array) {
            finale += '<li><button data-id="' + i.id + '" class="dropdown-item content" type="button">' + i.nome + '</button></li>'
        }
        $('#dropDownSearch').empty();
        $('#dropDownSearch').append(finale);
        console.log(active)
        if (!active) {
            $(".dropdown-menu").toggle("on");
            active = true;
        }
    }

    (() => {
        if (location.pathname == "/comingsoon.html") {
            $.get('http://localhost:8080/api/film', function (response) {
                $('#containerFilmArrivo').empty();
                listaFilm = response;
                let result = '<h2>IN ARRIVO</h2><div class="row mt-3">';
                let counter = 0;
                for (let film of response) {
                    if (film.condizione == "arrivo") {
                        if (counter % 3 == 0) {
                            if (counter == 3) {
                                result += '<h2 class="mt-3 mb-4">DA NON PREDERE</h2>'
                            }
                            result += '</div><div class="row mt-5">';
                        }
                        result += '<div class="col-md"><div class="text-center"><a href="#"><img data-id="' + film.id + '" src="' + film.img + '"alt="" width="70%" class="content  contenitoreFilm"></a><div class="mt-4"><p class="titolo-film">' + film.nome + '</a><p class="genere">' + film.genere + '</p></div></div></div>'
                        counter++;
                    }
                }
                result += '</div>';
                $('#containerFilmArrivo').append(result);
            })
        }
    })();

    async function riempiListaFilm() {
        listaFilm = null;
        await $.get('http://localhost:8080/api/film', await function (response) {
            $('#containerFilmSala').empty();
            listaFilm = response;
        });
        return listaFilm;
    }

    //reindirizzamento alla pagine film dopo aver clickato sul film nella homepage
    $('body').on("click", ".content", function () {
        let infoFilm = $(this).attr("data-id");
        $.cookie("filmId", infoFilm);
        window.location.pathname = "film.html"
    });

    (async () => {
        if (window.location.pathname == "/film.html") {
            let idFilm = $.cookie("filmId");
            let filmInfo = await findFilmById(idFilm)
            $('#img-pagina-film').attr("src", filmInfo.img);
            $('#titolo-pagina-film').append(filmInfo.nome);
            $('#descrizione-pagina-film').append(filmInfo.descrizione);
            $('#regia-pagina-film').append(filmInfo.regia);
            $('#cast-pagina-film').append(filmInfo.cast);
            $('#img-banner1-film').attr("src", filmInfo.img1);
            $('#img-banner2-film').attr("src", filmInfo.img2);
            $('#img-banner3-film').attr("src", filmInfo.img3);
            $('#url-pagina-film').attr("src", filmInfo.urlTrailer + '?rel=0&modestbranding=1&autohide=1&mute=0&showinfo=0&controls=1&autoplay=1');
            if (filmInfo.condizione == "sala") {
                $('#btnPrenota').show();
            }
        }
    })();

    async function findFilmById(idFilm) {
        let info;
        await $.get('http://localhost:8080/api/film/' + idFilm, function (response) {
            info = {
                id: response.id,
                nome: response.nome,
                descrizione: response.descrizione,
                img: response.img,
                regia: response.regia,
                cast: response.cast,
                genere: response.genere,
                img1: response.imgBannerUno,
                img2: response.imgBannerDue,
                img3: response.imgBannerTre,
                etaMinima: response.etaMinima,
                anno: response.anno,
                durata: response.durata,
                urlTrailer: response.urlTrailer,
                condizione: response.condizione,
                proiezioni: response.proiezioni,
                oraInizio: response.oraInizio
            }
        });
        return info;
    }
    //FINE HOMEPAGE FILM+PAGINA FILM////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let JWTHeader = {
        Authorization: 'Bearer ' + $.cookie('jwt')
    }

    let info = null;
    let infoOspite = null;
    let jwtCookie = $.cookie("jwt");

    //imposta i dettagli nella pagina utente
    (async () => {
        if (window.location.href.indexOf("/profilo.html") > -1) {
            $.cookie("username", new URLSearchParams(window.location.search))
            if ($.cookie("profilo") != null & $.cookie("profilo") != "") {
                info = JSON.parse($.cookie("profilo"));
            }
            infoOspite = await getUserInfoUsername($.cookie("username").substring(0, $.cookie("username").length - 1));
            impostaPaginaUtente();
            if (checkCookieTime()) {
                checkModificaProfiloPossibile();
            }
        } else {
            //console.log($.cookie("profilo"));
            //info = JSON.parse($.cookie("profilo"));
            if (info != null & checkCookieTime()) {
                impostaProfilo(info.email);
            }
        }
    })();



    //CHECK ATTRVAERSO JWT SE L'UNTENTE è LOGGATO + EXPERATION DATE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function checkCookieTime() {
        if (jwtCookie != null && jwtCookie != "") {
            let payloadData = extractPayload(jwtCookie);
            let jwtData = new Date(payloadData[1] * 1000);
            let data = new Date();
            if (jwtData.getTime() > data.getTime()) {
                if (location.pathname == '/profilo.html') {
                }
                impostaProfiloEmail(payloadData[0]);
                return true;
            } else {
                $.cookie('jwt', "");
                info = null;
                return false;
            }
        } else {
            $('#btnLogin').css("display", "block")
            $.cookie('jwt', "");
            info = null;
            return false;
        }
    };

    function checkCookieTimeOnly() {
        jwtCookie = $.cookie("jwt");
        if (jwtCookie != null && jwtCookie != "") {
            let payloadData = extractPayload(jwtCookie);
            let jwtData = new Date(payloadData[1] * 1000);
            let data = new Date();
            if (jwtData.getTime() > data.getTime()) {
                return true;
            } else {
                $('#containerImg').hide();
                $('#btnLogin').css("display", "block")
                $.cookie('jwt', "");
                info = null;
                return false;
            }
        } else {
            $('#containerImg').hide();
            $('#btnLogin').css("display", "block")
            $.cookie('jwt', "");
            info = null;
            return false;
        }
    }

    async function impostaProfiloEmail(email) {
        info = await getUserInfo(email);
        $('#btnLogin').hide()
        $('#imgProfilo').attr("src", "img/avatar/" + info.img)
        $('#containerImg').show();
        $('.imp').hide();
        if (info.ruoli[0].id == 1) {
            $('.imp').show();
        }
    }

    async function impostaProfilo() {
        let infoDentro = JSON.parse(info);
        $('#btnLogin').hide()
        $('#imgProfilo').attr("src", "img/avatar/" + infoDentro.img)
        $('#containerImg').show();
        $('.imp').hide();
        if (infoDentro.ruoli[0].id == 1) {
            $('.imp').show();
        }
    }

    async function getUserInfoUsername(username) {
        let infoUsername = null;
        await $.get('http://localhost:8080/api/username/' + username, function (response) {
            let uInfo = {
                id: response.id,
                username: response.username,
                email: response.email,
                img: response.img,
                descrizioneProfilo: response.descrizioneProfilo,
                dataIscrizione: response.dataIscrizione,
                dataNascita: response.dataNascita,
                prenotazioni: response.prenotazioni,
                ruoli: response.ruoli
            };
            infoUsername = uInfo;
            $.cookie("profiloUtente", JSON.stringify(uInfo));
            //alert(JSON.parse($.cookie("profilo")))
        })
        return infoUsername;
        //return JSON.parse($.cookie("profiloUtente"));
    }

    async function getUserInfo(email) {
        info = await getUserInfoByEmail(email);
        return info;
        //return JSON.parse($.cookie("profilo"));
    };

    async function getUserInfoByEmail(email) {
        info = null;
        await $.get('http://localhost:8080/api/email/' + email, function (response) {
            let uInfo = {
                id: response.id,
                username: response.username,
                email: response.email,
                img: response.img,
                descrizioneProfilo: response.descrizioneProfilo,
                dataIscrizione: response.dataIscrizione,
                dataNascita: response.dataNascita,
                prenotazioni: response.prenotazioni,
                ruoli: response.ruoli
            };
            info = uInfo;
        });
        return info;
    }

    //imposta il nome del profilo utente nell url e portalo alla pagina profilo
    $('#clickProfilo').click(function () {
        $('#clickProfilo').attr("href", "profilo.html?" + info.username)
    });

    //esegue logout
    $('#btnLogout').click(function () {
        let payloadData = extractPayload($.cookie("jwt"));
        let jwtData = new Date(payloadData[1] * 1000);
        let data = new Date();
        if (jwtData.getTime() > data.getTime()) {
            logout();
        }
    })

    function logout() {
        $('#containerImg').hide();
        $('#btnLogin').show()
        $.cookie("profilo", "")
        $.cookie("jwt", "")
        info = null;
        updateHeader();
        location.reload();
    }
    //FINE CHECK ATTRVAERSO JWT SE L'UNTENTE è LOGGATO + EXPERATION DATE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //PRENOTAZIONE FILM////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $('#btnPrenota').click(async function () {
        if (checkCookieTimeOnly()) {
            let idFilm = $.cookie("filmId");
            let film = await findFilmById(idFilm);
            let data = new Date();
            let ora = data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();
            let result = '<option value="">Seleziona proiezione</option>';
            for (let proiezione of film.proiezioni) {
                let dataProiezione = (new Date(proiezione.data))
                console.log(proiezione.oraInizio, ora);
                if (dataProiezione > data) {
                    result += '<option data-id="' + proiezione.id + '">' + proiezione.data + ' ' + proiezione.oraInizio + '</option>'
                } else if (dataProiezione == data) {
                    if (proiezione.oraInizio > ora) {
                        result += '<option data-id="' + proiezione.id + '">' + proiezione.data + ' ' + proiezione.oraInizio + '</option>'
                    }
                }
            }
            $('#movie').empty();
            $('.container1').empty();
            $('#movie').append(result);
            $('#modalePrenotazione').modal('show');
        } else {
            modalRisposta("Effettuare il login per prenotare", 2);
        }
    });

    $('#movie').change(async function () {
        let idProiezione = $('#movie option:selected').attr("data-id");
        let postiOccupati = await getPostiOccupatiProiezione(idProiezione);
        let idSala = await trovaSalaProiezione(idProiezione);
        riempiPosti(postiOccupati, idSala);
    })

    async function getPostiOccupatiProiezione(idProiezione) {
        let proiezione = null;
        let posti = null;
        await $.get('http://localhost:8080/api/posto', async function (response) {
            posti = response;
        });
        await $.get('http://localhost:8080/api/proiezione/' + idProiezione, function (response) {
            proiezione = response;
        });
        let postiOccupati = trovaPostiOccupati(posti, proiezione)
        proiezioneSelezionata = proiezione;
        return postiOccupati;
    }

    let proiezioneSelezionata = null;

    async function trovaSalaProiezione(idProiez) {
        let sale = await getSale();
        for (let sala of sale) {
            for (let proiezione of sala.proiezioni) {
                if (proiezione.id == idProiez) {
                    return sala.id;
                }
            }
        }
    }

    function trovaPostiOccupati(posti, proiezione) {
        let postiOccupati = [];
        let c = 0;
        for (let posto of posti) {
            for (let prenotazione of posto.prenotazioni) {
                for (let preno of proiezione.prenotazioni) {
                    if (prenotazione.id == preno.id) {
                        postiOccupati[c] = posto.numeroPosto;
                        c++;
                    }
                }
            }
        }
        return postiOccupati;
    }

    function riempiPosti(postiOccupati, idSala) {
        let result = '<div class="screen"></div><div class="row1">';
        for (let i = 1; i < 78; i++) {
            let idPosto = (77 * (idSala - 1)) + i;
            let esiste = false;
            if (postiOccupati != []) {
                esiste = postiOccupati.some(e => e == i);
            }
            if (i % 11 == 0) {
                if (esiste) {
                    result += '<div data-idPosto="' + idPosto + '" data-numero="' + i + '" class="seat occupied"></div></div><div class="row1">'
                } else {
                    result += '<div data-idPosto="' + idPosto + '" data-numero="' + i + '" class="seat"></div></div><div class="row1">'
                }
            } else {
                if (esiste) {
                    result += '<div data-idPosto="' + idPosto + '" data-numero="' + i + '" class="seat occupied"></div>';
                } else {
                    result += '<div data-idPosto="' + idPosto + '" data-numero="' + i + '" class="seat"></div>';
                }
            }

        }
        result += '</div><p class="text">Hai selezionato <span id="count">0</span> posti per un totale di <span id="total">0</span> euro.</p>';
        $('.container1').empty();
        $('.container1').append(result);
    }

    $('body').on('click', '#apriPagamento', function () {
        if (selectedSeatsCount > 0) {
            $('#quantitaBiglietti').html(selectedSeatsCount);
            $('#totaleDaPagare').html(selectedSeatsCount * 7 + "€")
            $('#modalePrenotazione').modal("hide");
            $('#modalPagamento').modal("show");
        }
    })

    $('body').on("click", "#eseguiAcquisto", async function () {
        if (checkPagamento()) {
            if (checkCookieTimeOnly()) {
                for (let posto of postiSelezionati) {
                    await prenotaFilm(posto)
                }
                modalRisposta("Prenotazione effettuata", 1);
            } else {
                modalRisposta("Effettuare il login per prenotare", 2);
            }
        } else {
            modalRisposta("Ricontrollare i dati inseriti", 2);
        }
    });

    function checkPagamento() {
        let nome = $('#nomePagamento').val().length > 1;
        let cognome = $('#cognomePagamento').val().length > 1;
        let nomeIntestatario = $('#nomeIntestatario').val().length > 3;
        let numeroCarta = $('#numeroCarta').val().length > 15;
        let scadenzaCarta = $('#scadenzaCarta').val().length > 3;
        let cvvCarta = $('#cvvCarta').val().length > 1;
        console.log(nome, cognome, nomeIntestatario, numeroCarta, scadenzaCarta, cvvCarta)
        if (nome & cognome & nomeIntestatario & numeroCarta & scadenzaCarta & cvvCarta) {
            return true;
        } else {
            return false;
        }
    }

    async function getPostoById(id) {
        let posto = null;
        await $.get('http://localhost:8080/api/posto/' + id, function (response) {
            posto = response;
        });
        return posto;
    }

    async function prenotaFilm(idPosto) {
        let posto = await getPostoById(idPosto)
        let params = {
            idAccount: info.id,
            idProiezione: proiezioneSelezionata.id,
            idPosto: posto.id
        }
        await $.ajax({
            url: 'http://localhost:8080/user/api/prenotazione/save',
            contentType: 'application/json;charset=UTF-8',
            type: 'POST',
            data: JSON.stringify(params),
            success: async function (data) {
                await modalRisposta("Prenotazione effettuata", 1);
            },
            error: async function () {
                await modalRisposta("Si è verificato un problema, riprovare piu' tardi.", 2);
            }
        });
        $('#modalPagamento').modal('hide');
    }


    //PRENOTAZIONE
    if (location.pathname == "/film.html") {
        const container = document.querySelector('.container1');
        const seats = document.querySelectorAll('.row .seat:not(.occupied)');
        const count = $('#count');
        const total = $('#total');
        const movieSelect = document.getElementById('movie');



        //Movie Select Event
        movieSelect.addEventListener('change', e => {
            ticketPrice = +e.target.value;
            updateSelectedCount();
        });

        //Seat click event
        container.addEventListener('click', e => {
            if (e.target.classList.contains('seat') &&
                !e.target.classList.contains('occupied')) {
                e.target.classList.toggle('selected');
            }
            updateSelectedCount();
        });
    }

    let selectedSeatsCount;
    let postiSelezionati = [];
    //Update total and count
    function updateSelectedCount() {
        //document.querySelectorAll('.row .seat.selected');
        postiSelezionati = [];
        const selectedSeats = document.querySelectorAll('.row .seat.selected');
        let c = 0;
        $('.selected').each(function () {
            postiSelezionati[c] = $(this).attr("data-idPosto")
            c++
        })

        selectedSeatsCount = selectedSeats.length;
        //count.innerText = selectedSeatsCount;
        $("#count").empty();
        $("#count").append(selectedSeatsCount);
        //total.innerText = selectedSeatsCount * ticketPrice;
        let totale = selectedSeatsCount * 7;
        $("#total").empty();
        $("#total").append(totale);
    }


    //FINE PRENOTAZIONE FILM////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //PROFILO UTENTE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function impostaPaginaUtente() {
        $('#imgProfiloUtente').attr("src", "img/avatar/" + infoOspite.img);
        $('#username').append('@' + infoOspite.username);
        $('#descrizioneProfilo').append(infoOspite.descrizioneProfilo);
        let datiFilm = await infoFilmUtente();
        $('#filmValutati').append(datiFilm[2]);
        $('#vistiDiRecente').append(datiFilm[0]);
        $('#vistiTotale').append(datiFilm[1]);
        let result = await findLastFilms();
        $('#valutazioniUtenti').append(result);
    }

    function infoFilmUtente() {
        let counterRecenti = 0;
        let counterAllTime = infoOspite.prenotazioni.length;
        let valutazioni = 0;
        const date = new Date();

        for (let prenotazione of infoOspite.prenotazioni) {
            if (prenotazione.valutazione > 0) {
                valutazioni++;
            }
        }

        for (let prenotazione of infoOspite.prenotazioni) {
            let responseDate = new Date(prenotazione.data).getMonth();
            if (responseDate == date.getMonth()) {
                counterRecenti++;
            }
        }


        return [counterRecenti, counterAllTime, valutazioni];
    }

    async function findLastFilms() {
        let c = 0;
        let result = '';
        for (let prenotazione of infoOspite.prenotazioni) {
            if (prenotazione.valutazione > 0) {
                if (c < 3) {
                    let idFilm = await findFilmId(prenotazione.id);
                    let film = await getFilmById(idFilm);
                    //result += '<div class="row mt-2"><div class="colProfiloUtente col-4 mt-5"><img id="imgFilm" src="' + film.img + '"></div><div class="colProfiloUtente col-3"><p id="nomeFilm1" class="ms-3">' + film.nome + '</p></div>'
                    //result += giveValutazione(prenotazione.valutazione)
                    //result += '<div class="col-1"><p>'+film.descrizione+ '</p></div></div>'
                    result += '<div class="col-lg my-3"><div class="card text-center h-100 parentCard" style="max-width: 500px!important"><img src="' + film.img + '" class="card-img-top"/><div class="card-body"><h5 class="card-title">' + film.nome + '</h5><p class="card-text" style="height: 8rem">' + film.descrizione + '</p>'
                    result += giveValutazione(prenotazione.valutazione);
                    result += '</div></div></div>'
                }
                c++;
            }
        }
        return result;
    }

    async function findFilmId(idPrenotazione) {
        listaFilm = await riempiListaFilm();
        for (let film of listaFilm) {
            if (film.proiezioni != null) {
                for (let proiezione of film.proiezioni) {
                    if (proiezione.prenotazioni != null) {
                        for (let prenotazione of proiezione.prenotazioni) {
                            if (prenotazione.id == idPrenotazione) {
                                return film.id;
                            }
                        }
                    }
                }
            }
        }
    }

    async function getFilmById(id) {
        let filmInfo = null;
        await $.get('http://localhost:8080/api/film/' + id, function (response) {
            filmInfo = {
                nome: response.nome,
                img: response.img,
                descrizione: response.descrizione
            }
        });
        return filmInfo;
    }

    //mostra le immagini di profilo disponibili
    $('#imgProfiloUtente').click(function (event) {
        event.preventDefault();
        if (checkModificaProfiloPossibile()) {
            $('#modaleRisposta').empty();
            let result = '<h3 class="modal-title" id="contentModalRisposta">Selezione l\'immagine di profilo</h3>'
            for (let i = 1; i < 12; i++) {
                result += '<a href=""><img class="cambiaImgProfilo immaginiProfiloUtenti" data-img="profilo' + i + '.png" src="img/avatar/profilo' + i + '.png" class="rounded-circle" height="250"/></a>'
            }
            $('#modaleRisposta').append(result, 1);
            $('#modalRisposta').modal('toggle');
        }
    });

    //imposta la nuova immagine di profilo
    $(document).on("click", ".cambiaImgProfilo", async function (event) {
        event.preventDefault();
        if (checkModificaProfiloPossibile()) {
            let img = $(this).attr("data-img");
            let params = {
                immagine: img
            }
            await $.ajax({
                url: 'http://localhost:8080/user/api/account/update/immagine/' + info.id,
                contentType: 'application/json;charset=UTF-8',
                type: 'PUT',
                data: JSON.stringify(params),
                success: async function (data) {
                    await modalRisposta("Immagine cambiata", 1);
                },
                error: async function () {
                    await modalRisposta("Immagine non cambiata, provare piu' tardi.", 2);
                }
            });
            location.reload();
        }
    });
    //prova a vedere se l'utente che modifica il profilo è lo stesso utente del profilo che si visualizza
    function checkModificaProfiloPossibile() {
        //info = $.cookie("profilo");

        if (info != null & info != "" & infoOspite != null) {
            //info = JSON.parse(info);
            //alert(infoOspite);
            if (null != info) {
                if (info.username == infoOspite.username) {
                    $('#btnModificaDesc').css("display", "inline")
                    return true;
                }
            }
        }
        return false;
    };

    $('#btnSendModificaProfilo').click(async function () {
        let params = {
            username: $('#cambiaUsername').val(),
            descrizione: $('#cambiaDescrizione').val()
        }
        $('#modalUpdateUsernameDescr').modal("toggle");
        await $.ajax({
            url: 'http://localhost:8080/user/api/account/update/usernamedescr/' + info.id,
            contentType: 'application/json;charset=UTF-8',
            type: 'PUT',
            data: JSON.stringify(params),
            success: function (data) {
                modalRisposta("Modifiche effettuate", 1);
                info.username = $('#cambiaUsername').val();
                window.location = "http://127.0.0.1:5500/profilo.html?" + $('#cambiaUsername').val();
            },
            error: function () {
                modalRisposta("Qualcosa è andato storto", 2);
            }
        });
    });

    $('body').on("click", "#btnModificaDesc", function () {
        $('#cambiaUsername').val(info.username);
        $('#cambiaDescrizione').val(info.descrizioneProfilo);
        $('#modalUpdateUsernameDescr').modal("toggle");
    });

    $('body').on('mouseenter', ".immaginiProfiloUtenti", function () {
        $(this).addClass('transition');
    });
    $('body').on('mouseleave', ".immaginiProfiloUtenti", function () {
        $(this).removeClass('transition');
    });
    //FINE PROFILO UTENTE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //CLASSIFICA UTENTI////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let topAccountMese = new Map();
    let topAccountAt = new Map();
    let utenti = null;
    //se sei sulla pagina della classifica
    if (location.pathname == '/classifica.html') {
        //popoliamo mappa to paccount mese e all time
        $.get('http://localhost:8080/api/account', function (response) {
            utenti = response;
            for (account of response) {
                if (topAccountAt.has(account.id)) {
                    topAccountAt[account.id] = account.prenotazioni.length;
                } else {
                    topAccountAt.set(parseInt(account.id), account.prenotazioni.length);
                }
            }
            const date = new Date();
            for (account of response) {
                for (prenotazione of account.prenotazioni) {
                    let responseDate = new Date(prenotazione.data).getMonth();
                    if (responseDate == date.getMonth() && topAccountMese.has(account.id)) {
                        topAccountMese.set(account.id, topAccountMese.get(account.id) + 1);
                    } else if (!topAccountMese.has(account.id) && responseDate == date.getMonth()) {
                        topAccountMese.set(parseInt(account.id), 1);
                    }
                }
            }
            topAccountAt = new Map([...topAccountAt].sort((a, b) => b[1] - a[1]));
            topAccountMese = new Map([...topAccountMese].sort((a, b) => b[1] - a[1]));
            //chiamata al metodo per inserire account  mnesili nella tabella al aprirsi della pagina
            inserimentoUtentiClassifica(topAccountAt);
        })

        $("#btnClassificaMensile").click(function () {
            inserimentoUtentiClassifica(topAccountMese);
        })
        $("#btnClassificaAt").click(function () {
            inserimentoUtentiClassifica(topAccountAt);
        })


        //creaiamo la lista degli utenti e la inseriamo nella tabella  (mappa account mensili/alltime)
        function inserimentoUtentiClassifica(accountMap) {
            $("#tableBodyClassifica tr").remove();
            let result = null;
            let counter = 1;
            //let accounts = Array.from(accountMap.keys());
            for (let [key, value] of accountMap) {
                let utente = getUtente(key);
                result += '<tr><td><span class="badge badge-success rounded-pill d-inline">' + counter + '</span></td><td><div class="d-flex align-items-center">'
                result += '<img src="img/avatar/' + utente.img + '" alt=""style="width: 45px; height: 45px" class="rounded-circle" /><div class="ms-3"><p class="fw-bold mb-1 usernameClassifica">' + utente.username + '</p></div></div></td>'
                result += '<td><p class="fw-normal mb-1">' + value + '</p></td><td><p>' + utente.dataIscrizione + '</p></td><td><button type="button" class="btn btn-link btn-sm btn-rounde btnVediProfiloClassifica" data-username="' + utente.username + '">Vedi</button></td></tr>'
                counter++;
            }
            $('#tableBodyClassifica').append(result);
        }


        //attraverso un id andiamo a prenderci un specifico oggetto Utente
        function getUtente(idUtente) {
            for (utente of utenti) {
                if (utente.id == idUtente) {
                    return utente;
                }
            }
        }

        //ti porta al profilo utente che clicki
        $('body').on("click", '.btnVediProfiloClassifica', function () {
            let uname = $(this).attr("data-username");
            uname = "?" + uname;
            window.location = "http://127.0.0.1:5500/profilo.html" + uname;
        })


    }
    //FINE CLASSIFICA UTENTI////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //PRENOTAZIONI////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $('#iconaCarello').click(function () {
        if (checkCookieTimeOnly()) {
            window.location = "http://127.0.0.1:5500/prenotazioni.html"
        } else {
            modalRisposta("Effettuare il login", 2);
        }
    });

    (async () => {
        if (location.pathname == "/prenotazioni.html") {
            info = await getUserInfoByEmail(extractPayload($.cookie("jwt"))[0]);
            let prenotazioniUtenteComplete = await trovaPrenotazioniComplete(info.prenotazioni);
            appendPrenotazioni(prenotazioniUtenteComplete);
        }
    })();

    async function getProiezioni() {
        let proiezioni = null;
        await $.get('http://localhost:8080/api/proiezioni', function (response) {
            proiezioni = response;
        });
        return proiezioni;
    }

    async function trovaPrenotazioniComplete(prenotazioni) {
        let films = await getFilm();
        let prenotazioniUtenteComplete = [];
        let posti = await getPosti();
        let sale = await getSale();
        let c = 0;
        for (let prenotazione of prenotazioni) {
            for (film of films) {
                //console.log(film)
                //console.log(film.proiezioni)
                for (proiezione of film.proiezioni) {
                    for (prenot of proiezione.prenotazioni) {
                        if (prenot.id == prenotazione.id) {
                            for (let sala of sale) {
                                for (proiez of sala.proiezioni) {
                                    if (proiez.id == proiezione.id) {
                                        let numPosto = await trovaNumeroPosto(posti, prenotazione)
                                        let prenotazioneCompleta = {
                                            nomeFilm: film.nome,
                                            imgFilm: film.img,
                                            dataFilm: proiezione.data,
                                            oraFilm: proiezione.oraInizio,
                                            numPosto: numPosto,
                                            numSala: sala.id,
                                            idPrenotazione: prenot.id,
                                            valutazione: prenot.valutazione
                                        }
                                        prenotazioniUtenteComplete[c] = prenotazioneCompleta;
                                        c++;
                                    }
                                }

                            }
                        }
                    }
                }
            }
        }
        prenotazioniPronte = prenotazioniUtenteComplete;
        return prenotazioniUtenteComplete;
    }



    function appendPrenotazioni(prenotazioniCompleta) {
        let result = '<div class="row mt-3">';
        let c = 0;
        console.log("dentro append" + prenotazioniCompleta);
        for (let prenot of prenotazioniCompleta) {
            console.log(prenot);
            if (c != 0 & c % 3 == 0) {
                result += '</div><div class="row mt-3">'
            }
            result += '<div class="col"><div class="card" style="max-width: 25rem;"><img src="' + prenot.imgFilm + '" class="card-img-top" alt="Fissure in Sandstone" /><div class="card-body row"><h4 class="card-title">' + prenot.nomeFilm + '</h4>'
            result += '<div class="col text-start"><h5 class="mt-2"><i class="far fa-calendar-alt"></i> ' + prenot.dataFilm + '</h5><h5 class="mt-2"><i class="far fa-clock"></i> ' + prenot.oraFilm + '</h5><h5 class="mt-2"><i class="fas fa-person-booth" style="color: white;"></i> Sala: ' + prenot.numSala + '</h5><h5 class="mt-2"><i class="fa-solid fa-chair" style="color: white;"></i> Posto: ' + prenot.numPosto + '</h5></div>'
            result += '<div class="col"><img class="mt-2 mb-3" src="img/qr.png" alt="" style="max-width: 110px;"></div><div class="rating pb-0"> <input class="valuta" data-film="' + prenot.idPrenotazione + '" type="radio" name="rating" value="5" id="5' + c + '"><label for="5' + c + '">☆</label><input class="valuta" data-film="' + prenot.idPrenotazione + '" type="radio" name="rating" value="4" id="4' + c + '"><label for="4' + c + '">☆</label>'
            result += '<input class="valuta" data-film="' + prenot.idPrenotazione + '" type="radio" name="rating" value="3" id="3' + c + '"><label for="3' + c + '">☆</label><input class="valuta" data-film="' + prenot.idPrenotazione + '" type="radio" name="rating" value="2" id="2' + c + '"><label for="2' + c + '">☆</label><input class="valuta" data-film="' + prenot.idPrenotazione + '" type="radio" name="rating" value="1" id="1' + c + '"><label for="1' + c + '">☆</label></div></div></div></div>'
            c++;
        }
        result += '</div>';
        console.log("fatto");
        $('#containerPrenotazioni').empty();
        $('#containerPrenotazioni').append(result);
    }

    $('#ordinaPrenotazioni').click(async function () {
        await ordinaPrenotazioni();
        appendPrenotazioni(prenotazioniPronte);
    });

    let prenotazioniPronte;
    async function ordinaPrenotazioni() {
        prenotazioniPronte.sort(await function compare(a, b) {
            let dateA = new Date(a.dataFilm);
            let dateB = new Date(b.dataFilm);
            return dateB - dateA;
        });
    }

    // function ordinaPrenotazioni(){
    //     let temp;
    //     let finito = [];
    //     for (let i = 0; i < prenotazioniPronte.length; i++) {
    //         for (let j = i+1; j<prenotazioniPronte.length; j++){
    //             if(prenotazioniPronte[i].dataFilm > prenotazioniPronte[j].dataFilm){
    //                 temp = finito[i];
    //                 finito[i] = prenotazioniPronte[j]
    //                 finito[j] = temp;
    //                 console.log(finito[i]);
    //                 console.log(finito[i] , finito[j], i)
    //             }
    //         }
    //     }
    //     console.log("dentro la ordin" + finito);
    //     appendPrenotazioni(finito);
    // };

    $('body').on("click", '.valuta', function () {
        let voto = $(this).val();
        let idPrenotazione = $(this).attr("data-film");
        setValutazione(voto, idPrenotazione);
    });


    //assegna valutazione
    function setValutazione(voto, idPrenotazione) {
        let valutazione = {
            valutazione: voto
        }
        $.ajax({
            url: 'http://localhost:8080/user/api/prenotazione/update/' + idPrenotazione,
            contentType: 'application/json;charset=UTF-8',
            type: 'PUT',
            data: JSON.stringify(valutazione),
            success: async function (data) {
                modalRisposta("Valutazione assegnata", 1);
            },
            error: async function () {
                modalRisposta("Si è verificato un errore, riprovare piu' tardi.", 2);
            }
        });
    }

    async function getSale() {
        let sale = null;
        await $.get('http://localhost:8080/api/sala', function (response) {
            sale = response;
        });
        return sale;
    }

    async function getPosti() {
        let posti = null;
        await $.get('http://localhost:8080/api/posto', function (response) {
            posti = response;
        });
        return posti;
    }

    async function getFilm() {
        let film = null;
        await $.get('http://localhost:8080/api/film', function (response) {
            film = response;
        });
        return film;
    }

    function trovaNumeroPosto(posti, prenotazione) {
        for (let posto of posti) {
            for (let prenot of posto.prenotazioni) {
                if (prenotazione.id == prenot.id) {
                    return posto.numeroPosto;
                }
            }
        }
    }
    //FINE PRENOTAZIONI////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





    //REGISTRAZIONE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $('#submitRegister').click(function () {
        let email = $('#emailRegister').val();
        let username = $('#usernameRegister').val();
        let dataNascita = $('#dateRegister').val();
        let pass = $('#passwordRegister').val();
        let passConfirm = $('#passwordRegisterConfirm').val();
        if (testRegisterForm(username, email, pass, passConfirm, "flexCheckDefault")) {
            let params = {
                email: email,
                username: username,
                dataNascita: dataNascita,
                pass: pass
            }
            $.ajax({
                url: 'http://localhost:8080/api/auth/signup',
                contentType: 'application/json;charset=UTF-8',
                type: 'POST',
                data: JSON.stringify(params),
                success: function () {
                    resetForm("registerForm");
                    $('#modalRegister').modal('hide');
                    modalRisposta("Benvenuto su Somnia!", 1)
                },
                error: function () {

                }

            });
        } else {
            modalRisposta("Ricontrolla i campi inseriti e accettare i termini.", 2);
        }
    });

    $('#submitLogin').click(function () {
        let email = $('#emailLogin').val();
        let pass = $('#passwordLogin').val();
        let params = {
            email: email,
            pass: pass
        }
        console.log("dentro");
        $.ajax({
            url: 'http://localhost:8080/api/auth/login',
            contentType: 'application/json;charset=UTF-8',
            type: 'POST',
            data: JSON.stringify(params),
            success: function (response) {
                checkModificaProfiloPossibile();
                resetForm("formLogin");
                $('#modalLogin').modal('toggle');
                let token = response.accessToken;
                $.cookie("jwt", token);
                JWTHeader = updateHeader();
                impostaProfiloEmail(extractPayload(token)[0]);
                modalRisposta("Benvenuto su Somnia!", 1)
                //location.reload(true);
            },
            error: function () {
                $('modalLogin').modal('hide');
                modalRisposta("Email o password errati!", 2)
            }
        })
    })

    $('#submitRecupera').click(function () {
        $('#modalRecuperaPassword').modal("hide");
    });


    function modalRisposta(risposta, id) {
        if (id != 1) {
            $('#modaleRisposta').css("background-color", "rgb(202, 136, 136)");
            $('#modaleRisposta').css("color", "black");
        } else {
            $('#modaleRisposta').css("background-color", "#D6F0E0");
            $('#modaleRisposta').css("color", "green");
        }
        $('#contentModalRisposta').empty();
        $('#contentModalRisposta').append(risposta);
        $('#modalRisposta').modal('toggle');
        setTimeout(function () {
            $('#modalRisposta').modal('hide')
        }, 1500);
    }


    //update jwtHeader
    function updateHeader() {
        return {
            Authorization: 'Bearer ' + $.cookie('jwt')
        }
    }

    //reset form di register/login
    function resetForm(formName) {
        $('#' + formName).trigger('reset');
    }





    //SECURITY MODALE LOGIN/ REGISTER////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function testRegisterForm(username, email, pass, passConfirm, idCheckbox) {
        if (checkPasswordEquals(pass, passConfirm) && isEmail(email) & testUsername(username) & checkBoxIfChecked(idCheckbox)) {
            return true;
        } else {
            return false;
        }
    }

    function checkBoxIfChecked(id) {
        return $('#' + id).is(':checked');
    }

    let cRegister = 0;
    $('body',).on('mouseenter', "#submitRegister", function () {
        let email = $('#emailRegister').val();
        let username = $('#usernameRegister').val();
        let pass = $('#passwordRegister').val();
        let passConfirm = $('#passwordRegisterConfirm').val();
        if (testRegisterForm(username, email, pass, passConfirm, "flexCheckDefault")) {
        } else {
            if (cRegister % 2 == 0) {
                setTimeout(function () {
                    $('#submitRegister').css('transform', `translateX(100px)`)
                }, 100)
            } else {
                setTimeout(function () {
                    $('#submitRegister').css('transform', `translateX(-100px)`)
                }, 100)
            }
            cRegister++;
        }
    });

    let cLogin = 0;
    $('body',).on('mouseenter', "#submitLogin", function () {
        let email = $('#emailLogin').val().length > 2;
        let pass = $('#passwordLogin').val().length > 2;
        if (email & pass) {
        } else {
            if (cLogin % 2 == 0) {
                setTimeout(function () {
                    $('#submitLogin').css('transform', `translateX(100px)`)
                }, 100)
            } else {
                setTimeout(function () {
                    $('#submitLogin').css('transform', `translateX(-100px)`)
                }, 100)
            }
            cLogin++;
        }
    });

    function testUsername(username) {
        if (username.length > 4) {
            $('#formUsernameRegister').css("display", "none");
            return true;
        } else {
            $('#formUsernameRegister').removeClass();
            $('#formUsernameRegister').addClass("note note-warning mb-3");
            $('#formUsernameRegister').css("display", "block");
            $('#formUsernameRegister').html("L'username deve contenere almeno 4 caratteri");
            return false;
        }
    }

    $('#usernameRegister').on("input", function () {
        testUsername($('#usernameRegister').val());
    })

    $('#passwordRegister').on("input", function () {
        checkPasswordStrength($('#passwordRegister').val());
    })

    $('#passwordRegisterConfirm').on("input", function () {
        checkPasswordEquals($('#passwordRegister').val(), $('#passwordRegisterConfirm').val());
    })

    $('#emailRegister').on("input", function () {
        isEmail($('#emailRegister').val());
    })


    function checkPasswordStrength(password) {
        var number = /([0-9])/;
        var alphabets = /([a-zA-Z])/;
        var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;
        password = password.trim();
        if (password.length < 8) {
            $('#formPasswordRegister').removeClass();
            $('#formPasswordRegister').addClass("note note-danger mb-3");
            $('#formPasswordRegister').css("display", "block");
            $('#formPasswordRegister').html("La password deve centenere almeno 8 caratteri");
        } else {
            if (password.match(number) && password.match(alphabets) && password.match(special_characters)) {
                $('#formPasswordRegister').css("display", "none");
            }
            else {
                $('#formPasswordRegister').removeClass();
                $('#formPasswordRegister').addClass("note note-warning mb-3");
                $('#formPasswordRegister').css("display", "block");
                $('#formPasswordRegister').html("La password deve contenere numeri, lettere e caratteri speciali");
            }
        }
    }



    function checkPasswordEquals(password, confirmPassword) {
        if (password.trim() == confirmPassword.trim()) {
            $('#formConfermaPasswordRegister').css("display", "none");
            return true;
        } else {
            $('#formConfermaPasswordRegister').removeClass();
            $('#formConfermaPasswordRegister').addClass("note note-warning mb-3");
            $('#formConfermaPasswordRegister').css("display", "block");
            $('#formConfermaPasswordRegister').html("Le password non coincidono");
            return false;
        }

    }

    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (regex.test(email)) {
            $('#formEmailRegister').css("display", "none");
        } else {
            $('#formEmailRegister').removeClass();
            $('#formEmailRegister').addClass("note note-warning mb-3");
            $('#formEmailRegister').css("display", "block");
            $('#formEmailRegister').html("L'email inserita non è valida");
        }
        return regex.test(email);
    }


    //FINE SECURITY MODALE LOGIN/ REGISTER////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    //ADMIN PANEL/////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $.get('http://localhost:8080/api/film', function (response) {
        //console.log(response);
        let listaFilms = response;
        //console.log(listaPortate);
        let selectContent = '';
        for (film of listaFilms) {
            selectContent += createInput(film);
            //console.log(film);
        }
        //let deleteButton = '<div class="modal-footer"> <button type="button" class="btn btn-primary" id="deleteBtn">Elimina </button></div>';
        //console.log('select content: ' + selectContent);
        //$('.in').append('<td data-film = ></td>')
        //$('#updatePortata').html(selectContent);
        //console.log('opzioni = ' + selectContent);
        $('#deleteFilm').append(selectContent);
        //$('#deleteFilm').append(deleteButton);
    });

    $('body').on('click', '.eliminaFilmbtn', function (e) {
        e.preventDefault();
        let id = $(this).attr('data-id');
        //preparazione dei dati da inviare al server
        //let films = getFilm();
        /*let params = {
            id: films.id
        };*/

        $.ajax({
            url: 'http://localhost:8080/admin/api/film/delete/' + id,
            contentType: 'application/json;charset=UTF-8',
            type: 'DELETE',
            //data: JSON.stringify(params),
            success: async function (data) {
                await modalRisposta("Film eliminato");
                // $('#modalRisposta').modal('show');
            },
            error: async function () {
                await modalRisposta("Film non eliminato, provare piu' tardi.");
                //$('#modalRisposta').modal('show');
            }
        });
    });

    $.get('http://localhost:8080/api/prenotazione', function (response) {
        let listaPrenotazioni = response;
        console.log(listaPrenotazioni);
        let input = '';
        for (pren of listaPrenotazioni) {

            input += createListPren(pren);
        }
        console.log(pren);
        $('.pren').append(input);
    })

    $('body').on('click', '.eliminaPrenbtn', function (e) {
        e.preventDefault();
        let id = $(this).attr('data-id');
        //preparazione dei dati da inviare al server
        //let films = getFilm();
        /*let params = {
            id: films.id
        };*/

        $.ajax({
            url: 'http://localhost:8080/admin/api/prenotazione/delete/' + id,
            contentType: 'application/json;charset=UTF-8',
            type: 'DELETE',
            //data: JSON.stringify(params),
            success: async function (data) {
                await modalRisposta("Prenotazione eliminata");
                // $('#modalRisposta').modal('show');
            },
            error: async function () {
                await modalRisposta("Prenotazione non eliminata, provare piu' tardi.");
                //$('#modalRisposta').modal('show');
            }
        });
    });

    $('.imp').click(function () {

        location.href = 'admin.html';
        //$('.nameFilm').append('Film');
    })

    $('#natale').click(function () {
        $('#logoSomnia').attr('src', 'img/somnia_logonatale.png');

    })

    $('#pasqua').click(function () {
        $('#logoSomnia').attr('src', 'img/logo_pasqua.png');

    })

    $('#standard').click(function () {
        $('#logoSomnia').attr('src', 'img/logo.png');

    })





    //FINE ADMIN PANEL/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

});



//CREAZIONE LISTA FILM ADMIN PANEL/////////////////////////////////////////////////////////////////////////////////////////////////////
function createInput(inputData) {
    let input = '<div class="row">	<div class="form-check"><label class="form-check-label"for="flexRadioDefault1">' + inputData.nome + '</label> <div> <button type="button" class="  btn-outline-warning mb-2 eliminaFilmbtn" data-id="' + inputData.id + '">Elimina </button></div></div></div>';
    //console.log('option = ' + option);
    return input;
}

//CREAZIONE LISTA PRENOTAZIONI PER ELIMINAZIONE/////////////////////////////////////////////////////////////////////////7
function createListPren(prenotazione) {
    let input = '<div class="modalTXT1"><div class="row"><div class="col">ID</div><div class="col">DATA</div><div class="col">VALUTAZIONE</div></div> <div> </div><div class="modalTXT2"><div class="row"><div class="col" id="idPrenotazione">' + prenotazione.id + '</div><div class="col" id="data">' + prenotazione.data + '</div> <div class="col" id="valutazione">' + prenotazione.valutazione + ' <div class="row mt-2"><button type="button" class="btn-outline-warning mb-10 eliminaPrenbtn" data-id="' + prenotazione.id + '">Elimina </button></div></div></div></div></div>'

    return input;
}

function extractPayload(token) {
    let array = token.split(".");
    let payload = array[1];
    let jsonPayload = atob(payload);
    let objPayload = JSON.parse(jsonPayload);
    //console.log(objPayload)
    let userEmail = objPayload.sub;
    let dataExp = objPayload.exp;
    //console.log("user email = " + userEmail + ", data expiration = " + dataExp);
    return [userEmail, dataExp];
}

function giveValutazione(valutazione) {
    switch (valutazione) {
        case 0:
            return '<div class="col colStella"><input type="radio" name="rate" id="valutazione1" data-idx="1" hidden><label class="stellaVuota labelProfiloutente" for="valutazione1"></label><input type="radio" name="rate" id="valutazione2" data-idx="2" hidden><label class="stellaVuota labelProfiloutente" for="valutazione2"></label><input type="radio" name="rate" id="valutazione3" data-idx="3" hidden><label class="stellaVuota labelProfiloutente" for="valutazione3"></label><input type="radio" name="rate" id="valutazione4" data-idx="4" hidden><label class="stellaVuota labelProfiloutente" for="valutazione4"></label><input type="radio" name="rate" id="valutazione5" data-idx="5" hidden><label class="stellaVuota labelProfiloutente" for="valutazione5"></label></div>'
        case 1:
            return '<div class="col colStella"><input type="radio" name="rate" id="valutazione1" data-idx="1" hidden><label class="stellaPiena labelProfiloutente" for="valutazione1"></label><input type="radio" name="rate" id="valutazione2" data-idx="2" hidden><label class="stellaVuota labelProfiloutente" for="valutazione2"></label><input type="radio" name="rate" id="valutazione3" data-idx="3" hidden><label class="stellaVuota labelProfiloutente" for="valutazione3"></label><input type="radio" name="rate" id="valutazione4" data-idx="4" hidden><label class="stellaVuota labelProfiloutente" for="valutazione4"></label><input type="radio" name="rate" id="valutazione5" data-idx="5" hidden><label class="stellaVuota labelProfiloutente" for="valutazione5"></label></div>'
        case 2:
            return '<div class="col colStella"><input type="radio" name="rate" id="valutazione1" data-idx="1" hidden><label class="stellaPiena labelProfiloutente" for="valutazione1"></label><input type="radio" name="rate" id="valutazione2" data-idx="2" hidden><label class="stellaPiena labelProfiloutente" for="valutazione2"></label><input type="radio" name="rate" id="valutazione3" data-idx="3" hidden><label class="stellaVuota labelProfiloutente" for="valutazione3"></label><input type="radio" name="rate" id="valutazione4" data-idx="4" hidden><label class="stellaVuota labelProfiloutente" for="valutazione4"></label><input type="radio" name="rate" id="valutazione5" data-idx="5" hidden><label class="stellaVuota labelProfiloutente" for="valutazione5"></label></div>'
        case 3:
            return '<div class="col colStella"><input type="radio" name="rate" id="valutazione1" data-idx="1" hidden><label class="stellaPiena labelProfiloutente" for="valutazione1"></label><input type="radio" name="rate" id="valutazione2" data-idx="2" hidden><label class="stellaPiena labelProfiloutente" for="valutazione2"></label><input type="radio" name="rate" id="valutazione3" data-idx="3" hidden><label class="stellaPiena labelProfiloutente" for="valutazione3"></label><input type="radio" name="rate" id="valutazione4" data-idx="4" hidden><label class="stellaVuota labelProfiloutente" for="valutazione4"></label><input type="radio" name="rate" id="valutazione5" data-idx="5" hidden><label class="stellaVuota labelProfiloutente" for="valutazione5"></label></div>'
        case 4:
            return '<div class="col colStella"><input type="radio" name="rate" id="valutazione1" data-idx="1" hidden><label class="stellaPiena labelProfiloutente" for="valutazione1"></label><input type="radio" name="rate" id="valutazione2" data-idx="2" hidden><label class="stellaPiena labelProfiloutente" for="valutazione2"></label><input type="radio" name="rate" id="valutazione3" data-idx="3" hidden><label class="stellaPiena labelProfiloutente" for="valutazione3"></label><input type="radio" name="rate" id="valutazione4" data-idx="4" hidden><label class="stellaPiena labelProfiloutente" for="valutazione4"></label><input type="radio" name="rate" id="valutazione5" data-idx="5" hidden><label class="stellaVuota labelProfiloutente" for="valutazione5"></label></div>'
        case 5:
            return '<div class="col colStella"><input type="radio" name="rate" id="valutazione1" data-idx="1" hidden><label class="stellaPiena labelProfiloutente" for="valutazione1"></label><input type="radio" name="rate" id="valutazione2" data-idx="2" hidden><label class="stellaPiena labelProfiloutente" for="valutazione2"></label><input type="radio" name="rate" id="valutazione3" data-idx="3" hidden><label class="stellaPiena labelProfiloutente" for="valutazione3"></label><input type="radio" name="rate" id="valutazione4" data-idx="4" hidden><label class="stellaPiena labelProfiloutente" for="valutazione4"></label><input type="radio" name="rate" id="valutazione5" data-idx="5" hidden><label class="stellaPiena labelProfiloutente" for="valutazione5"></label></div>'
    }
}












