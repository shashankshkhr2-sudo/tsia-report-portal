export type AssignmentEmployee={id:string,full_name:string,role:string,specialization:string|null,is_active:boolean,available:boolean,capacity:number,workload:number}
export type AssignmentClient={id:string,client_number:string|null,full_name:string,date_of_birth:string,email:string|null,created_at:string,primary_employee_id:string|null,website:boolean}
export type AssignmentHistory={id:string,client_id:string,previous_employee_id:string|null,employee_id:string|null,actor_id:string,method:'admin'|'system',reason:string,created_at:string}
export type AssignmentData={clients:AssignmentClient[],employees:AssignmentEmployee[],history:AssignmentHistory[]}
export function suggestedEmployees(employees:AssignmentEmployee[]) {
 return employees.filter(e=>e.is_active && e.available && e.workload<e.capacity)
 .sort((a,b)=>a.workload-b.workload || a.id.localeCompare(b.id))
}
