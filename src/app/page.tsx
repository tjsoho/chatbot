import ChatWindow from "../components/ChatWidget/ChatWindow";


export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Sloane Bot Demo Page</h1>
      <ChatWindow />
    </main>
  );
}
