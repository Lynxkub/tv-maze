      const noImage = "https://tinyurl.com/tv-missing"
      async function searchShows(query) {
       
        const showName= await axios.get("http://api.tvmaze.com/search/shows", {params:{q:query}});
       
        let results = showName.data.map(result=>{
          let show = result.show;
          return{
            id: show.id,
            name: show.name,
            summary: show.summary,
            image: show.image ? show.image.medium : noImage
            
          }
        })
        return results;
      }
      
      
      
      /
      
      function populateShows(shows) {
        const $showsList = $("#shows-list");
        $showsList.empty();
      
        for (let show of shows) {
          let $item = $(
            `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
               <div class="card" data-show-id="${show.id}">
               <img class="card-img-top" src="${show.image}">
                 <div class="card-body">
                   <h5 class="card-title">${show.name}</h5>
                   <p class="card-text">${show.summary}</p>
                   <button class= "btn btn-info episode">Episode List</button>
                 </div>
               </div>
             </div>
            `);
      
          $showsList.append($item);

        }

      }
      
      
      
      
      $("#search-form").on("submit", async function handleSearch (evt) {
        evt.preventDefault();
      
        let query = $("#search-query").val();
        if (!query) return;
      
        $("#episodes-area").hide();
      
        let shows = await searchShows(query);
      
        populateShows(shows);
      });
      
      
      
      
      async function getEpisodes(id) {
        
      const episodes= await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
      let episodeData=episodes.data.map(results=>({
        id: results.id,
        name: results.name,
        season: results.season,
        number: results.number
      }))
      return episodeData;
       
      }
      function populateEpisodes(episodeData){
        const $episodesList = $("#episodes-list");
        $episodesList.empty();
        for(let episodes of episodeData){
          let $line = $(`<li>${episodes.name}(season ${episodes.season}, episode ${episodes.number})</li>`);
          $episodesList.append($line);
        }
        $("#episodes-area").show();
      }

      $("#shows-list").on("click", ".episode", async function episodeClick(e){
        let showId = $(e.target).closest(".Show").data("show-id");
        let episodes = await getEpisodes(showId);
        populateEpisodes(episodes);
      });