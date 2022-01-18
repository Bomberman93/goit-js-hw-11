import axios from 'axios';

export default class FetchImageApi {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    fetchImage() {
        console.log(this)
        const BASE_URL = 'https://pixabay.com/api/'; 
        const pixabayKey = '24437827-e20f686b1c65a4a2859f17630';

   const getImagine = async() => {
   const images =  await axios.get(`${BASE_URL}?key=${pixabayKey}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`);
   return images;
   }
   return getImagine()
   
   .then(images => {
       
      
    //    console.log(images.data.totalHits);
       this.incrementPage();
       console.log(images.data);
      
       return images.data
       
   })
  .catch(error => console.log("Error") )
    }
    
       
    
      


    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
}
