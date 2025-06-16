import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function LeagueCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 h-30">
        <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-3 animate-pulse"></div>

        <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
      </CardContent>

      <CardFooter className="px-4 py-2 border-t">
        <div className="h-3 bg-gray-200 rounded-md w-4/5 animate-pulse"></div>
      </CardFooter>
    </Card>
  );
}
