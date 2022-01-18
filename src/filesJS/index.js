import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import FetchImageApi from './fetchImageApi';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryList: document.querySelector('.gallery'),
  container: document.querySelector('.container'),
  loadMore: document.querySelector('.load-more'),
  searchQueryInput: document.querySelector('[name="searchQuery"]'),
};

const fetchImageApi = new FetchImageApi();
let iteratorPage = 0;

refs.searchForm.addEventListener('submit', handleFormSubmit);
refs.loadMore.addEventListener('click', handleBtnClick);
refs.loadMore.style.display = 'none';

async function handleFormSubmit(evt) {
  evt.preventDefault();
  if (refs.searchQueryInput.value === '') {
    clearGalleryList();
    refs.loadMore.style.display = 'none';
    return;
  }
  
  fetchImageApi.searchQuery = evt.currentTarget.elements.searchQuery.value;
  fetchImageApi.resetPage();
  const data = await fetchImageApi.fetchImage()
    if (data.hits.length === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }
    iteratorPage = 40;
    const totalHits = data.totalHits;
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    refs.loadMore.style.display = 'block';
    return renderImageList(data);
  
}

function renderImageList(data) {
  const markup = data.hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<a class="gallery-item" href="${largeImageURL}"><div class="photo-card"> 
        <img class="photo-image" src="${webformatURL}"  alt="${tags}" loading="lazy"/>
         <div class="info">
           <p class="info-item">
             <b>Likes: ${likes}</b>
           </p>
           <p class="info-item">
             <b>Views: ${views}</b>
           </p>
           <p class="info-item">
             <b>Comment: ${comments}</b>
           </p>
           <p class="info-item">
             <b>Downloads: ${downloads}</b>
           </p>
         </div>
       </div></a>`;
    })
    .join('');
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
  let lightbox = new SimpleLightbox('.gallery a');
}

async function handleBtnClick() {
  const data = await fetchImageApi.fetchImage()
    iteratorPage += 40;
    if (data.totalHits <= iteratorPage) {
      refs.loadMore.style.display = 'none';
      renderImageList(data);
      return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    }
}
function clearGalleryList() {
  refs.galleryList.innerHTML = '';
}
