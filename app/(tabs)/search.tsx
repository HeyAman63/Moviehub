import MovieCard from '@/component/movieCard';
import SearchBar from '@/component/searchBar';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchMovie } from '@/services/api';
import { useFetch } from '@/services/useFetch';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { updateSearchCount } from '../../services/appwrite';



const search = () => {

  const [searchQuery, setSearchQuery] = useState('');
  
    const {
      data:movies,
      loading:moviesLoading, 
      error:moviesError,
      refetch:loadMovies,
      reset,
    }
      = useFetch(()=>fetchMovie({
      query: searchQuery
    }), false);

    useEffect(()=>{
        const timeOutId = setTimeout(async()=>{
          if(searchQuery.trim()){
            await loadMovies();
            
          }else{
            reset();
          }
      },800)
      return ()=>clearTimeout(timeOutId);
    },[searchQuery])

      // Update search count when movies arrive
      useEffect(()=>{
        if(searchQuery.trim() && movies && movies.length > 0){
          updateSearchCount(searchQuery, movies[0]);
        }
      },[movies])
  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 w-full absolute z-0' resizeMode='cover'/>
      <FlatList
      data={movies}
      renderItem={({item})=>(
        <MovieCard {...item}/>
      )}
      keyExtractor={(item)=>item.id.toString()}
      className='px-5 '
      numColumns={3}
      columnWrapperStyle={{
        justifyContent:"center",
        gap:16,
        marginVertical:16,
      }}
      contentContainerStyle={{
        paddingBottom:100
      }}
      ListHeaderComponent={
        <>
        <View className='w-full flex-row justify-center mt-20 items-center'>
          <Image source={icons.logo} className='w-12 h-10'/>
        </View>
        <View className='my-5'>
          <SearchBar value={searchQuery} onChangeText={(text : string ) => setSearchQuery( text )}  placeholder='Search Movies....' onPress={()=>null}/>
        </View>
        {moviesLoading&&(
          <ActivityIndicator size='large' color='#0000ff' className='my-3'/>
        )}
        {moviesError&&(
          <Text className='text-red-500 px-5 py-3'>Error: {moviesError?.message}</Text>
        )}
        {!moviesLoading&&moviesError&& searchQuery.trim()&&movies?.length>0 && (
          <Text className='text-white font-bold text-xl'>
            Search result for{" "}
            <Text className='text-accent'>{searchQuery}</Text>
          </Text>
        )}
        </>
      }
      ListEmptyComponent={
        !moviesLoading && !moviesError ? (
          <View className='mt-10 px-5'>
            <Text className='text-center text-gray-500'>
              {searchQuery.trim()?"No Movies Found":"Search for a movie"}
            </Text>
          </View>
        ):null
      }
      />
    </View>
  )
}

export default search