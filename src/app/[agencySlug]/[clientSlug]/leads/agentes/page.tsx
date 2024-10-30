export default function Agentes() {
    return (
      <div className="w-full h-[calc(100vh-110px)]">
        <iframe
            src="https://agentes.agency-planner.com"
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Sitio externo"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    )
  }
  