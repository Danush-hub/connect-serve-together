
import { useState } from "react";
import { Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface Certificate {
  id: string;
  title: string;
  date: string;
  downloadUrl?: string;
}

interface VolunteerCertificatesProps {
  certificates: Certificate[];
  formatDate: (date: string) => string;
}

export const VolunteerCertificates = ({ certificates, formatDate }: VolunteerCertificatesProps) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (certId: string, title: string) => {
    setDownloading(certId);
    
    // This would connect to your Supabase backend to download the certificate
    try {
      // Simulate API call to download certificate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Certificate Downloaded",
        description: `${title} has been downloaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Certificates</CardTitle>
        <CardDescription>Your earned certificates</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {certificates.length > 0 ? (
            <>
              {certificates.map(cert => (
                <li key={cert.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center space-x-3">
                  <Award className="h-5 w-5 text-volunteer" />
                  <div className="flex-1">
                    <div className="font-medium">{cert.title}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(cert.date)}</div>
                  </div>
                  {cert.downloadUrl && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="px-2" 
                      onClick={() => handleDownload(cert.id, cert.title)}
                      disabled={downloading === cert.id}
                    >
                      {downloading === cert.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      <span className="sr-only">Download</span>
                    </Button>
                  )}
                </li>
              ))}
              <li className="text-center pt-1">
                <Button variant="link" className="text-volunteer">View All Certificates</Button>
              </li>
            </>
          ) : (
            <li className="text-center py-6">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-muted-foreground">No certificates earned yet</p>
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};
