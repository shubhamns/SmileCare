import { gql } from "@apollo/client";
export const GET_CLINICS = gql`
  query GetClinics {
    clinics { id name address phone timezone }
  }
`;
export const GET_SERVICES = gql`
  query GetServices {
    services { id name description duration price icon }
  }
`;
export const GET_DENTISTS = gql`
  query GetDentists($clinicId: ID) {
    dentists(clinicId: $clinicId) { id name specialty rating reviews avatar clinicId clinic { id name } }
  }
`;
export const GET_APPOINTMENTS = gql`
  query GetAppointments($patientEmail: String, $clinicId: ID, $date: String, $dentistId: ID) {
    appointments(patientEmail: $patientEmail, clinicId: $clinicId, date: $date, dentistId: $dentistId) {
      id patientName patientEmail patientPhone reason date time status clinicId
      service { id name }
      dentist { id name }
      clinic { id name }
    }
  }
`;
export const GET_STATS = gql`
  query GetStats {
    stats { patients dentists clinics appointments avgRating }
  }
`;
export const GET_PATIENTS = gql`
  query GetPatients {
    patients { id name email phone lastVisit clinicName }
  }
`;
export const GET_BOOKED_SLOTS = gql`
  query GetBookedSlots($date: String!, $dentistId: ID!) {
    bookedSlots(date: $date, dentistId: $dentistId)
  }
`;
export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs {
    auditLogs { id action userName role resource ip createdAt }
  }
`;
export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) { id name email role }
  }
`;
export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($email: String!, $currentPassword: String!, $newPassword: String!) {
    changePassword(email: $email, currentPassword: $currentPassword, newPassword: $newPassword)
  }
`;
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!, $role: Role!) {
    login(email: $email, password: $password, role: $role) {
      id name email role phone avatar clinicId
    }
  }
`;
export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment($input: CreateAppointmentInput!) {
    createAppointment(input: $input) {
      id patientName patientEmail date time status
      service { name }
      dentist { name }
      clinic { name address }
    }
  }
`;
export const CANCEL_APPOINTMENT = gql`
  mutation CancelAppointment($id: ID!) {
    cancelAppointment(id: $id) { id status }
  }
`;
export const UPDATE_APPOINTMENT_STATUS = gql`
  mutation UpdateAppointmentStatus($id: ID!, $status: AppointmentStatus!) {
    updateAppointmentStatus(id: $id, status: $status) { id status }
  }
`;
export const CREATE_CLINIC = gql`
  mutation CreateClinic($input: ClinicInput!) {
    createClinic(input: $input) { id name address phone timezone }
  }
`;
export const UPDATE_CLINIC = gql`
  mutation UpdateClinic($id: ID!, $input: ClinicInput!) {
    updateClinic(id: $id, input: $input) { id name address phone timezone }
  }
`;
export const DELETE_CLINIC = gql`
  mutation DeleteClinic($id: ID!) {
    deleteClinic(id: $id)
  }
`;
export const CREATE_SERVICE = gql`
  mutation CreateService($input: ServiceInput!) {
    createService(input: $input) { id name description duration price icon }
  }
`;
export const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $input: ServiceInput!) {
    updateService(id: $id, input: $input) { id name description duration price icon }
  }
`;
export const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id)
  }
`;
export const CREATE_DENTIST = gql`
  mutation CreateDentist($input: DentistInput!) {
    createDentist(input: $input) { id name specialty rating reviews avatar clinicId clinic { name } }
  }
`;
export const CREATE_DOCTOR_ACCOUNT = gql`
  mutation CreateDoctorAccount($input: CreateDoctorAccountInput!) {
    createDoctorAccount(input: $input) { id name specialty rating reviews avatar clinicId clinic { name } }
  }
`;
export const UPDATE_DENTIST = gql`
  mutation UpdateDentist($id: ID!, $input: DentistInput!) {
    updateDentist(id: $id, input: $input) { id name specialty rating reviews avatar clinicId clinic { name } }
  }
`;
export const DELETE_DENTIST = gql`
  mutation DeleteDentist($id: ID!) {
    deleteDentist(id: $id)
  }
`;
