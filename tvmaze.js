"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

async function getShowsByTerm(term) {
  try {
    const response = await axios.get("http://api.tvmaze.com/search/shows", {
      params: {
        q: term,
      },
    });
    const show = response.data.map((result) => {
      const { id, name, summary, image } = result.show;
      return {
        id,
        name,
        summary,
        image: image ? image.medium : "https://tinyurl.com/tv-missing",
      };
    });
    return show;
  } catch (error) {
    console.error("Error fetching TV shows:", error.message);
    throw new Error("Unable to fetch TV shows. Please try again later.");
  }
}
function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name} TV Show Poster"
              class=" card-img-top w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
}
async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

async function getEpisodesOfShow(showId) {
  try {
    const response = await axios.get(
      `http://api.tvmaze.com/shows/${showId}/episodes`
    );
    const episodes = response.data.map((result) => {
      const { id, name, season, number } = result;
      return { id, name, season, number };
    });
    return episodes;
  } catch (error) {
    console.error("Error fetching episodes:", error.message);
    throw new Error("Unable to fetch episodes. Please try again later.");
  }
}

function populateEpisodes(episodes) {
  $episodesArea.empty();

  for (let episode of episodes) {
    const $episodes = $(
`<li>
"${episode.name}"
(Season ${episode.season}, Ep: ${episode.number})
<li>
`
    );
    $episodesArea.append($episodes);
  }
  $episodesArea.show();
}
async function getEpisodesAndDisplay(event) {
  const showId = $(event.target).closest(".Show").data("show-id");
  const episodes = await getEpisodesOfShow(showId); // Define episodes here
  populateEpisodes(episodes);
}
$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);
