
export default function Avatar({userId, username}) {
  return (
    <div className="w-8 h-8 bg-red-300 rounded-full flex items-center">
        <div className="text-center">{username[0]}</div>
    </div>
  )
}
