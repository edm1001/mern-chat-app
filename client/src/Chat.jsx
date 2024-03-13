export default function Chat() {
  return (
    <div className="flex h-screen">
      <div className="bg-blue-100 w-1/3">contacts</div>
      <div className="bg-blue-300 w-2/3">
        <div>messages with contact</div>
        <div>
          <input
            type="text"
            placeholder="Type message here"
            className="bg-white border p-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
