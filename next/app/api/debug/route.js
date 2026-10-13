export async function GET() {
  // Intentional server-side error for debugging visibility
  throw new Error('Test server error from /api/debug — should appear in terminal and return 500');
}
