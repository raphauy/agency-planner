"use client"

import { useState, useRef } from "react"
import { KnockProvider, KnockFeedProvider, NotificationIconButton, NotificationFeedPopover, I18nContent, NotificationCell, Avatar } from "@knocklabs/react"

// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function NotificationFeed() {
  const [isVisible, setIsVisible] = useState(false)
  const notifButtonRef = useRef<HTMLButtonElement>(null);

  const router= useRouter()

  const currentUser= useSession().data?.user

  if (!currentUser || !currentUser.id) return null

  const i18n= getSpanishI18n()

  return (
    <KnockProvider
      apiKey={String(process.env.NEXT_PUBLIC_KNOCK_API_KEY)}
      userId={currentUser?.id}
      i18n={i18n}
    >
      <KnockFeedProvider feedId={String(process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID)}>
        <>
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={(e) => setIsVisible(!isVisible)}
          />
          <NotificationFeedPopover
            buttonRef={notifButtonRef as React.RefObject<HTMLElement>}
            isVisible={isVisible}
            onNotificationClick={(item) => {
              router.push(`${item.data ? item.data.publicationUrl : "/"}`)
              setIsVisible(false)
            }}
            onClose={() => setIsVisible(false)}
            renderItem={({ item, ...props }) => {
              const actor= item.actors[0]
              // @ts-ignore
              if (!actor || !actor.avatar) return <NotificationCell {...props} item={item} />

              return (
                <NotificationCell
                  key={item.id}
                  {...props}
                  item={item}
                  // @ts-ignore
                  avatar={<Avatar src={actor.avatar} alt={actor.name} size="sm" />}
                />
            )}}
          />
        </>
      </KnockFeedProvider>
    </KnockProvider>
  );
};

function getSpanishI18n() {
  const res: I18nContent= {
    translations: {
      emptyFeedTitle: "No hay notificaciones",
      emptyFeedBody: "No hay notificaciones",
      notifications: "Notificaciones",
      poweredBy: "",
      markAllAsRead: "Marcar todo como leído",
      archiveNotification: "Archivar notificación",
      all: "Todo",
      unread: "No leído",
      read: "Leído",
      unseen: "No visto",
      slackConnectChannel: "Conectar canal",
      slackChannelId: "ID del canal",
      slackConnecting: "Conectando...",
      slackDisconnecting: "Desconectando...",
      slackConnect: "Conectar",
      slackConnected: "Conectado",
      slackConnectContainerDescription: "Conecta tu cuenta de Slack para recibir notificaciones de nuevos mensajes.",
      slackSearchbarDisconnected: "Desconectado",
      slackSearchbarMultipleChannels: "Múltiples canales encontrados",
      slackSearchbarNoChannelsConnected: "No hay canales conectados",
      slackSearchbarNoChannelsFound: "No se encontraron canales",
      slackSearchbarChannelsError: "Error al buscar canales",
      slackSearchChannels: "Buscar canales",
      slackConnectionErrorOccurred: "Ocurrió un error al conectar",
      slackConnectionErrorExists: "Ya estás conectado",
      slackChannelAlreadyConnected: "El canal ya está conectado",
      slackError: "Error",
      slackDisconnect: "Desconectar",
      slackChannelSetError: "Error al establecer el canal",
      slackAccessTokenNotSet: "No se ha establecido el token de acceso",
      slackReconnect: "Reconectar",
    },
    locale: "es",
  }
  return res
}


