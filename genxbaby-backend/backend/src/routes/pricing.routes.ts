export async function POST(req: Request) {
  const body = await req.json();
  const priced = await priceScenario(body);
  return NextResponse.json(priced);
}
