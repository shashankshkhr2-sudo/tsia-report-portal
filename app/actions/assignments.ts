'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { AssignmentData } from '@/lib/assignment-types'

async function adminClient() {
 const db = await createClient()
 const {data:{user},error} = await db.auth.getUser()
 if (error || !user) throw new Error('Please sign in again.')
 const {data:profile,error:profileError} = await db.from('profiles').select('role,is_active,organization_id').eq('id',user.id).single()
 const role = String(profile?.role || '').trim().toLowerCase().replace(/[\s_-]+/g,'')
 if(profileError || !profile?.is_active || !profile.organization_id || !['admin','superadmin'].includes(role)) throw new Error('Administrator access required.')
 return db
}
export async function loadAssignments():Promise<{data?:AssignmentData,error?:string}> {
 try {
  const db=await adminClient()
  const {data,error}=await db.rpc('assignment_dashboard')
  if(error) return {error:'Assignment data unavailable. Check the staging migration and permissions.'}
  return {data:data as AssignmentData}
 } catch { return {error:'Unable to load assignment data. Check your administrator session.'} }
}
export async function assignPractitioner(input:{clientId:string,employeeId:string|null,expected:string|null,reason:string,automatic:boolean}) {
 try {
  const db=await adminClient()
  const {error}=await db.rpc('assign_client_practitioner',{p_client:input.clientId,p_employee:input.employeeId,p_expected:input.expected,p_reason:input.reason,p_auto:input.automatic})
  if(error) return {error:error.message}
  revalidatePath('/')
  return {success:true}
 } catch {return {error:'Assignment failed. Check your administrator session.'}}
}
export async function saveAvailability(employeeId:string,available:boolean,capacity:number) {
 try {
  const db=await adminClient()
  const {error}=await db.rpc('set_practitioner_availability',{p_employee:employeeId,p_available:available,p_capacity:capacity})
  if(error) return {error:error.message}
  return {success:true}
 } catch {return {error:'Availability could not be saved.'}}
}
