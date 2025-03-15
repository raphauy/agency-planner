export type WhatsappInstanceDAO = {
  externalId: string
  name: string
  number: string | null
  whatsappInboxId: string | null
  chatwootAccountId: number | null
  chatwootUrl: string | null
  chatwootAccessToken: string | null
  clientId: string
}

export const events = [
  "APPLICATION_STARTUP",
  "QRCODE_UPDATED",
  "MESSAGES_SET",
  "MESSAGES_UPSERT",
  "MESSAGES_UPDATE",
  "MESSAGES_DELETE",
  "SEND_MESSAGE",
  "CONTACTS_SET",
  "CONTACTS_UPSERT",
  "CONTACTS_UPDATE",
  "PRESENCE_UPDATE",
  "CHATS_SET",
  "CHATS_UPSERT",
  "CHATS_UPDATE",
  "CHATS_DELETE",
  "GROUPS_UPSERT",
  "GROUP_UPDATE",
  "GROUP_PARTICIPANTS_UPDATE",
  "CONNECTION_UPDATE",
  "LABELS_EDIT",
  "LABELS_ASSOCIATION",
  "CALL",
]



export interface Chatwoot {
  id: string
  enabled: boolean
  accountId: string
  token: string
  url: string
  nameInbox: string
  signMsg: boolean
  signDelimiter: string | null
  number: string | null
  reopenConversation: boolean
  conversationPending: boolean
  mergeBrazilContacts: boolean
  importContacts: boolean
  importMessages: boolean
  daysLimitImportMessages: number
  organization: string
  logo: string
  ignoreJids: string[]
  createdAt: string
  updatedAt: string
  instanceId: string
}

export type Rabbitmq = {
  id: string
  enabled: boolean
  events: string[]
  createdAt: string
  updatedAt: string
  instanceId: string
}

export type Proxy = {
  id: string
  enabled: boolean
  host: string
  port: string
  protocol: string
  username: string
  password: string
  createdAt: string
  updatedAt: string
  instanceId: string
}

export type Setting = {
  id: string
  rejectCall: boolean
  msgCall: string
  groupsIgnore: boolean
  alwaysOnline: boolean
  readMessages: boolean
  readStatus: boolean
  syncFullHistory: boolean
  createdAt: string
  updatedAt: string
  instanceId: string
}

  export type Count = {
  Message: number
  Contact: number
  Chat: number
}

export type WRCInstance = {
  id: string
  name: string
  connectionStatus: string
  ownerJid: string | null
  profileName: string | null
  profilePicUrl: string | null
  integration: string
  number: string
  businessId: string | null
  token: string
  clientName: string
  disconnectionReasonCode: string | null
  disconnectionObject: string | null
  disconnectionAt: string | null
  createdAt: string
  updatedAt: string
  Chatwoot: Chatwoot
  Proxy: Proxy | null
  Rabbitmq: Rabbitmq
  Sqs: string | null
  Websocket: string | null
  Setting: Setting
  _count: Count
}

export type ConnectInstance = {
  pairingCode: string | null
  code: string | null
  base64: string | null
  count: number
}

export type ConnectionStatus = {
  instanceName: string
  state: string
}

export type CreateInstanceResponse = {
  instance: {
    instanceName: string
    instanceId: string
    status: string
  }
  hash: {
    apikey: string
  }
  settings: Setting
}

export type ChatwootParams = {
  enabled: boolean
  accountId: string
  token: string
  url: string
  signMsg: boolean
  reopenConversation: boolean
  conversationPending: boolean
  nameInbox: string
  importContacts: boolean
  importMessages: boolean
  daysLimitImportMessages: number
  signDelimiter: string
  autoCreate: boolean
  organization: string
  logo: string
}