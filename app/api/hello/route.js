export const dynamic = 'force-dynamic'

export async function GET() {
  const secretWord = process.env.SECRET_WORD
  if (!secretWord) {
    return Response.json(
      { error: 'SECRET_WORD が設定されていません' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }
  return Response.json(
    { length: Array.from(secretWord).length },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
