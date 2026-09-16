export const typeDefs = `#graphql
  enum Role { PATIENT DOCTOR ADMIN }
  enum AppointmentStatus { CONFIRMED PENDING CANCELLED COMPLETED NO_SHOW }
  type Clinic {
    id: ID!
    name: String!
    address: String!
    phone: String!
    timezone: String!
    dentists: [Dentist!]!
  }
  type Service {
    id: ID!
    name: String!
    description: String!
    duration: Int!
    price: Int!
    icon: String!
  }
  type Dentist {
    id: ID!
    name: String!
    specialty: String!
    rating: Float!
    reviews: Int!
    avatar: String!
    clinicId: ID!
    clinic: Clinic!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    phone: String
    avatar: String
    clinicId: ID
  }
  type Appointment {
    id: ID!
    patientName: String!
    patientEmail: String!
    patientPhone: String
    reason: String
    date: String!
    time: String!
    status: AppointmentStatus!
    clinicId: ID!
    service: Service!
    dentist: Dentist!
    clinic: Clinic!
    createdAt: String!
  }
  type AuditLog {
    id: ID!
    action: String!
    userName: String!
    role: Role!
    resource: String!
    ip: String
    createdAt: String!
  }
  input RegisterInput {
    name: String!
    email: String!
    password: String!
    phone: String
  }
  input CreateAppointmentInput {
    patientName: String!
    patientEmail: String!
    patientPhone: String
    reason: String
    serviceId: ID!
    dentistId: ID!
    clinicId: ID!
    date: String!
    time: String!
  }
  input ClinicInput {
    name: String!
    address: String!
    phone: String!
    timezone: String!
  }
  input ServiceInput {
    name: String!
    description: String!
    duration: Int!
    price: Int!
    icon: String!
  }
  input DentistInput {
    name: String!
    specialty: String!
    rating: Float!
    reviews: Int!
    avatar: String!
    clinicId: ID!
  }
  input CreateDoctorAccountInput {
    name: String!
    email: String!
    password: String!
    specialty: String!
    rating: Float!
    reviews: Int!
    avatar: String!
    clinicId: ID!
  }
  input SettingInput {
    key: String!
    value: String!
  }
  type Setting {
    key: String!
    value: String!
  }
  type Stats {
    patients: Int!
    dentists: Int!
    clinics: Int!
    appointments: Int!
    avgRating: Float!
  }
  type PatientSummary {
    id: ID!
    name: String!
    email: String!
    phone: String
    lastVisit: String
    clinicName: String
  }
  type Query {
    clinics: [Clinic!]!
    clinic(id: ID!): Clinic
    services: [Service!]!
    service(id: ID!): Service
    dentists(clinicId: ID): [Dentist!]!
    dentist(id: ID!): Dentist
    appointments(patientEmail: String, clinicId: ID, date: String, dentistId: ID): [Appointment!]!
    appointment(id: ID!): Appointment
    bookedSlots(date: String!, dentistId: ID!): [String!]!
    auditLogs: [AuditLog!]!
    settings: [Setting!]!
    stats: Stats!
    patients: [PatientSummary!]!
  }
  type Mutation {
    login(email: String!, password: String!, role: Role!): User
    register(input: RegisterInput!): User!
    changePassword(email: String!, currentPassword: String!, newPassword: String!): Boolean!
    createAppointment(input: CreateAppointmentInput!): Appointment!
    updateAppointmentStatus(id: ID!, status: AppointmentStatus!): Appointment!
    cancelAppointment(id: ID!): Appointment!
    createClinic(input: ClinicInput!): Clinic!
    updateClinic(id: ID!, input: ClinicInput!): Clinic!
    deleteClinic(id: ID!): Boolean!
    createService(input: ServiceInput!): Service!
    updateService(id: ID!, input: ServiceInput!): Service!
    deleteService(id: ID!): Boolean!
    createDentist(input: DentistInput!): Dentist!
    createDoctorAccount(input: CreateDoctorAccountInput!): Dentist!
    updateDentist(id: ID!, input: DentistInput!): Dentist!
    deleteDentist(id: ID!): Boolean!
    upsertSettings(entries: [SettingInput!]!): [Setting!]!
    deleteSetting(key: String!): Boolean!
  }
`;
