
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Certificate {
  id: string;
  title: string;
  date: string;
}

interface VolunteerCertificatesProps {
  certificates: Certificate[];
  formatDate: (date: string) => string;
}

export const VolunteerCertificates = ({ certificates, formatDate }: VolunteerCertificatesProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Certificates</CardTitle>
        <CardDescription>Your earned certificates</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {certificates.map(cert => (
            <li key={cert.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center space-x-3">
              <Award className="h-5 w-5 text-volunteer" />
              <div className="flex-1">
                <div className="font-medium">{cert.title}</div>
                <div className="text-xs text-muted-foreground">{formatDate(cert.date)}</div>
              </div>
            </li>
          ))}
          <li className="text-center pt-1">
            <Button variant="link" className="text-volunteer">View All Certificates</Button>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};
