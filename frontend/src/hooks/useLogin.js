import React from 'react'
import {useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import {login}  from '../lib/api.js';
const useLogin = () => {
    const queryClient=useQueryClient();
    const {mutate:loginMutation,isPending,error}=useMutation({
    mutationFn:login,
    onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUser"]})
  });
  return{error:error,isPending,loginMutation}
}

export default useLogin
