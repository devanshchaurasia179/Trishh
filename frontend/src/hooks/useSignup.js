import React from 'react'
import {useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import {signup}  from '../lib/api.js';
const useSignup = () => {
  const queryClient=useQueryClient();
  const{mutate:signupMutation,isPending,error}=useMutation({
    mutationFn:signup,
    onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUser"]})
  })
  return{error:error,isPending,signupMutation}
}

export default useSignup
