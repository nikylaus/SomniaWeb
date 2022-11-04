$(document).ready(function () {
    console.log($.cookie("jwt"))
    $.cookie("profilo", "");
    //HOMEPAGE FILM+PAGINA FILM////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $('#containerFilmSala',).on('mouseenter', ".content", function () {
        $(this).addClass('transition');
    });
    $('#containerFilmSala').on('mouseleave', ".content", function () {
        $(this).removeClass('transition');
    });
    //popolazione film homepage
    let listaFilm = null;
    (() => {
        $.get('http://localhost:8080/api/film', function (response) {
            $('#containerFilmSala').empty();
            listaFilm = response;
            if (location.pathname == '/index.html') {
                let result = '<h2>NUOVI ARRIVI</h2><div class="row mt-3">';
                let counter = 0;
                for (let film of response) {
                    if (film.condizione == "sala") {
                        if (counter % 3 == 0) {
                            if (counter == 3) {
                                result += '<h2 class="mt-3 mb-4">DA NON PREDERE</h2>'
                            }
                            result += '</div><div class="row mt-5">';
                        }
                        result += '<div class="col-md"><div class="text-center"><a href="#"><img data-id="' + film.id + '" src="' + film.img + '"alt="" width="70%" class="content"></a><div class="mt-4"><a href="#" class="titolo-film">' + film.nome + '</a><p class="genere">' + film.genere + '</p></div></div></div>'
                    }
                    counter++;
                }
                result += '</div>';
                $('#containerFilmSala').append(result);
            }
        })
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

    async function impostaProfiloEmail(email) {
        info = await getUserInfo(email);
        $('#btnLogin').hide()
        $('#imgProfilo').attr("src", "img/avatar/" + info.img)
        $('#containerImg').show();
    }

    async function impostaProfilo() {
        console.log(info)
        let infoDentro = JSON.parse(info);
        $('#btnLogin').hide()
        $('#imgProfilo').attr("src", "img/avatar/" + infoDentro.img)
        $('#containerImg').show();
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
        console.log("denrtro" + info);
        console.log("asd1" + $.cookie("profilo"))
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
        let idFilm = $.cookie("filmId");
        let film = await findFilmById(idFilm);

        let data = new Date();
        let ora = data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();
        let result = '<option value="">Seleziona proiezione</option>';
        for (let proiezione of film.proiezioni) {
            let dataProiezione = (new Date(proiezione.data))
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
    });

    $('#movie').change(async function () {
        let idProiezione = $('#movie option:selected').attr("data-id");
        let postiOccupati = await getPostiOccupatiProiezione(idProiezione);
        console.log(postiOccupati);
        riempiPosti(postiOccupati);
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
        return postiOccupati;
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

    function riempiPosti(postiOccupati) {
        let result = '<div class="screen"></div><div class="row1">';
        for (let i = 1; i < 78; i++) {
            let esiste = false;
            if (postiOccupati != []) {
                esiste = postiOccupati.some(e => e == i);
            }
            if (i % 11 == 0) {
                if (esiste) {
                    result += '<div data-numero="' + i + '" class="seat occupied"></div></div><div class="row1">'
                } else {
                    result += '<div data-numero="' + i + '" class="seat"></div></div><div class="row1">'
                }
            } else {
                if (esiste) {
                    result += '<div data-numero="' + i + '" class="seat occupied"></div>';
                } else {
                    result += '<div data-numero="' + i + '" class="seat"></div>';
                }
            }

        }
        result += '</div><p class="text">Hai selezionato <span id="count">0</span> posti per un totale di <span id="total">0</span> euro.</p>';
        $('.container1').empty();
        $('.container1').append(result);
    }


    //PRENOTAZIONE
    if (window.location.path == "/film.html") {
        const container = document.querySelector('.container1');
        const seats = document.querySelectorAll('.row .seat:not(.occupied)');
        const count = $('#count');
        console.log("count:" + count)
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

    //Update total and count
    function updateSelectedCount() {
        //document.querySelectorAll('.row .seat.selected');
        const selectedSeats = document.querySelectorAll('.row .seat.selected');
        const selectedSeatsCount = selectedSeats.length - 1;
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
            if (c < 3) {
                let idFilm = await findFilmId(prenotazione.id);
                let film = await getFilmById(idFilm);
                //result += '<div class="row mt-2"><div class="colProfiloUtente col-4 mt-5"><img id="imgFilm" src="' + film.img + '"></div><div class="colProfiloUtente col-3"><p id="nomeFilm1" class="ms-3">' + film.nome + '</p></div>'
                //result += giveValutazione(prenotazione.valutazione)
                //result += '<div class="col-1"><p>'+film.descrizione+ '</p></div></div>'
                result += '<div class="col-lg my-3"><div class="card text-center" height="700px" style="max-width: 500px!important"><img src="' + film.img + '" class="card-img-top"/><div class="card-body"><h5 class="card-title">' + film.nome + '</h5><p class="card-text">' + film.descrizione + '</p>'
                result += giveValutazione(prenotazione.valutazione);
                result += '</div></div></div>'
            }
            c++;
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
            $('#modaleRisposta').append(result);
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
            console.log(JSON.stringify(params));
            await $.ajax({
                url: 'http://localhost:8080/user/api/account/update/immagine/' + info.id,
                contentType: 'application/json;charset=UTF-8',
                type: 'PUT',
                data: JSON.stringify(params),
                success: async function (data) {
                    await modalRisposta("Immagine cambiata");
                },
                error: async function () {
                    await modalRisposta("Immagine non cambiata, provare piu' tardi.");
                }
            });
            location.reload();
        }
    });
    //prova a vedere se l'utente che modifica il profilo è lo stesso utente del profilo che si visualizza
    function checkModificaProfiloPossibile() {
        //info = $.cookie("profilo");
        console.log("asd" + infoOspite);
        console.log(info);
        if (info != null & info != "" & infoOspite != null) {
            //info = JSON.parse(info);
            //alert(infoOspite);
            if (null != info) {
                console.log(info.username, infoOspite.username)
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
                modalRisposta("Modifiche effettuate");
                info.username = $('#cambiaUsername').val();
                console.log(info.username)
                window.location = "http://127.0.0.1:5500/profilo.html?" + $('#cambiaUsername').val();
            },
            error: function () {
                modalRisposta("Qualcosa è andato storto");
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
        window.location = "http://127.0.0.1:5500/prenotazioni.html"       
    });

    (async ()=>{
        if(window.location == "http://127.0.0.1:5500/prenotazioni.html"){
            console.log(extractPayload($.cookie("jwt"))[0])
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
        console.log("prenotazioni complete:" + prenotazioniUtenteComplete)
        return prenotazioniUtenteComplete;
    }

    function appendPrenotazioni(prenotazioniCompleta) {
        let result = '<div class="row mt-3">';
        let c = 0;
        for (let prenot of prenotazioniCompleta) {
            if (c != 0 & c % 3 == 0) {
                result += '</div><div class="row mt-3">'
            }
            result += '<div class="col"><div class="card" style="max-width: 25rem;"><img src="' + prenot.imgFilm + '" class="card-img-top" alt="Fissure in Sandstone" /><div class="card-body row"><h4 class="card-title">' + prenot.nomeFilm + '</h4>'
            result += '<div class="col text-start"><h5 class="mt-2"><i class="far fa-calendar-alt"></i> ' + prenot.dataFilm + '</h5><h5 class="mt-2"><i class="far fa-clock"></i> ' + prenot.oraFilm + '</h5><h5 class="mt-2"><i class="fas fa-person-booth" style="color: white;"></i> Sala: ' + prenot.numSala + '</h5><h5 class="mt-2"><i class="fa-solid fa-chair" style="color: white;"></i> Posto: ' + prenot.numPosto + '</h5></div>'
            result += '<div class="col"><img class="mt-2 mb-3" src="img/qr.png" alt="" style="max-width: 110px;"></div><div class="rating pb-0"> <input class="valuta" data-film="'+prenot.idPrenotazione+'" type="radio" name="rating" value="5" id="5"><label for="5">☆</label><input class="valuta" data-film="'+prenot.idPrenotazione+'" type="radio" name="rating" value="4" id="4"><label for="4">☆</label>'
            result += '<input class="valuta" data-film="'+prenot.idPrenotazione+'" type="radio" name="rating" value="3" id="3"><label for="3">☆</label><input class="valuta" data-film="'+prenot.idPrenotazione+'" type="radio" name="rating" value="2" id="2"><label for="2">☆</label><input class="valuta" data-film="'+prenot.idPrenotazione+'" type="radio" name="rating" value="1" id="1"><label for="1">☆</label></div></div></div></div>'
            c++;
        }
        result += '</div>';
        $('#containerPrenotazioni').empty();
        $('#containerPrenotazioni').append(result);
    }

    function giveValutazione(voto, idPrenotazione){
        let valutazione = {
            valutazione: voto
        }
        $.ajax({
            url: 'http://localhost:8080/user/api/prenotazione/update/' + idPrenotazione,
            contentType: 'application/json;charset=UTF-8',
            type: 'PUT',
            data: JSON.stringify(valutazione),
            success: async function (data) {
                modalRisposta("Valutazione assegnata");
            },
            error: async function () {
                modalRisposta("Si è verificato un errore, riprovare piu' tardi.");
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
                modalRisposta("Benvenuto su Somnia!")
            },
            error: function () {

            }

        })
    })

    $('#submitLogin').click(function () {
        let email = $('#emailLogin').val();
        let pass = $('#passwordLogin').val();
        let params = {
            email: email,
            pass: pass
        }
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
                console.log("token ricevuto = " + token);
                $.cookie("jwt", token);
                JWTHeader = updateHeader();
                impostaProfiloEmail(extractPayload(token)[0]);
                modalRisposta("Benvenuto su Somnia!")
                //location.reload(true);
            },
            error: function () {
                $('modalLogin').modal('hide');
                modalRisposta("Email o password errati!")
            }
        })
    })


    function modalRisposta(risposta) {
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





    //SCHEDA FILM////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    //FINE SCHEDA FILM////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

});

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
        case 1:
            return '<div><div class="colProfiloUtente col"><input type="radio" name="rate" id="valutazione1" data-idx="1" hidden><label class="stellaPiena labelProfiloutente" for="valutazione1"></label><input type="radio" name="rate" id="valutazione2" data-idx="2" hidden><label class="stellaVuota labelProfiloutente" for="valutazione2"></label><input type="radio" name="rate" id="valutazione3" data-idx="3" hidden><label class="stellaVuota labelProfiloutente" for="valutazione3"></label><input type="radio" name="rate" id="valutazione4" data-idx="4" hidden><label class="stellaVuota labelProfiloutente" for="valutazione4"></label><input type="radio" name="rate" id="valutazione5" data-idx="5" hidden><label class="stellaVuota labelProfiloutente" for="valutazione5"></label></div></div>'
        case 2:
            return '<div><div class="colProfiloUtente col"><input type="radio" name="rate" id="valutazione1" data-idx="1" hidden><label class="stellaPiena labelProfiloutente" for="valutazione1"></label><input type="radio" name="rate" id="valutazione2" data-idx="2" hidden><label class="stellaPiena labelProfiloutente" for="valutazione2"></label><input type="radio" name="rate" id="valutazione3" data-idx="3" hidden><label class="stellaVuota labelProfiloutente" for="valutazione3"></label><input type="radio" name="rate" id="valutazione4" data-idx="4" hidden><label class="stellaVuota labelProfiloutente" for="valutazione4"></label><input type="radio" name="rate" id="valutazione5" data-idx="5" hidden><label class="stellaVuota labelProfiloutente" for="valutazione5"></label></div></div>'
        case 3:
            return '<div><div class="colProfiloUtente col"><input type="radio" name="rate" id="valutazione1" data-idx="1" hidden><label class="stellaPiena labelProfiloutente" for="valutazione1"></label><input type="radio" name="rate" id="valutazione2" data-idx="2" hidden><label class="stellaPiena labelProfiloutente" for="valutazione2"></label><input type="radio" name="rate" id="valutazione3" data-idx="3" hidden><label class="stellaPiena labelProfiloutente" for="valutazione3"></label><input type="radio" name="rate" id="valutazione4" data-idx="4" hidden><label class="stellaVuota labelProfiloutente" for="valutazione4"></label><input type="radio" name="rate" id="valutazione5" data-idx="5" hidden><label class="stellaVuota labelProfiloutente" for="valutazione5"></label></div></div>'
        case 4:
            return '<div><div class="colProfiloUtente col"><input type="radio" name="rate" id="valutazione1" data-idx="1" hidden><label class="stellaPiena labelProfiloutente" for="valutazione1"></label><input type="radio" name="rate" id="valutazione2" data-idx="2" hidden><label class="stellaPiena labelProfiloutente" for="valutazione2"></label><input type="radio" name="rate" id="valutazione3" data-idx="3" hidden><label class="stellaPiena labelProfiloutente" for="valutazione3"></label><input type="radio" name="rate" id="valutazione4" data-idx="4" hidden><label class="stellaPiena labelProfiloutente" for="valutazione4"></label><input type="radio" name="rate" id="valutazione5" data-idx="5" hidden><label class="stellaVuota labelProfiloutente" for="valutazione5"></label></div></div>'
        case 5:
            return '<div><div class="colProfiloUtente col"><input type="radio" name="rate" id="valutazione1" data-idx="1" hidden><label class="stellaPiena labelProfiloutente" for="valutazione1"></label><input type="radio" name="rate" id="valutazione2" data-idx="2" hidden><label class="stellaPiena labelProfiloutente" for="valutazione2"></label><input type="radio" name="rate" id="valutazione3" data-idx="3" hidden><label class="stellaPiena labelProfiloutente" for="valutazione3"></label><input type="radio" name="rate" id="valutazione4" data-idx="4" hidden><label class="stellaPiena labelProfiloutente" for="valutazione4"></label><input type="radio" name="rate" id="valutazione5" data-idx="5" hidden><label class="stellaPiena labelProfiloutente" for="valutazione5"></label></div></div>'
    }
}












