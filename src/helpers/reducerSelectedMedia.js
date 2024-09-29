export const mediaDetails_InitialState = {
  results:[],
  heroBackground:'',
  title:'',
  poster:'',
  overview:'',
  releaseDate:'',
  vote:'',
  genres:[],
  loadingAllData:true,
  loadingCast:true
}

export const mediaD_Actions = {
  set_Media_Values: 'set_Media_Values',
  set_All_DataLoader: 'set_All_DataLoader',
}

export const reducerFunction = (state, action) => {
  switch(action.type){
   
    case mediaD_Actions.set_Media_Values:
      return{
        ...state,
        results:action.payload.results,
        heroBackground:action.payload.heroBackground,
        title:action.payload.title,
        poster:action.payload.poster,
        overview:action.payload.overview,
        releaseDate:action.payload.releaseDate,
        vote:action.payload.vote,
        genres:action.payload.genres,
        loadingAllData: action.payload.loadingAllData
      }

    case mediaD_Actions.set_All_DataLoader:
      return{
        ...state,
        loadingAllData: action.payload.loadingAllData
      }

    default:
      break;
    
  }
}