import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from "next-intl";


export default function Page() {
    const t = useTranslations('CleanLinen');

    return (
        <div>
            <SiteHeader headerTopic={t('headerTopic')} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        <Tabs defaultValue="tab1" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="tab1">{t('tab1')}</TabsTrigger>
                                <TabsTrigger value="tab2">{t('tab2')}</TabsTrigger>
                            </TabsList>
                            <TabsContent value="tab1">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('tab1')}</CardTitle>
                                        <CardDescription>
                                            Make changes to your account here. Click save when you're done.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" defaultValue="Pedro Duarte" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="username">Username</Label>
                                            <Input id="username" defaultValue="@peduarte" />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button>Save changes</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            <TabsContent value="tab2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('tab2')}</CardTitle>
                                        <CardDescription>
                                            Change your password here. After saving, you'll be logged out.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="current">Current password</Label>
                                            <Input id="current" type="password" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="new">New password</Label>
                                            <Input id="new" type="password" />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button>Save password</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>

    )
}
