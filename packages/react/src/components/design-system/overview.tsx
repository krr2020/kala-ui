import type * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../accordion';
import { Alert } from '../alert';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { Badge } from '../badge';
import { Breadcrumbs } from '../breadcrumbs';
// Component imports for previews
import { Button } from '../button';
import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { Checkbox } from '../checkbox';
import { Input } from '../input';
import { Label } from '../label';
import { Progress } from '../progress';
import { RadioGroup, RadioGroupItem } from '../radio-group';
import { Select, SelectTrigger, SelectValue } from '../select';
import { Skeleton } from '../skeleton';
import { Slider } from '../slider';
import { Spinner } from '../spinner';
import { Switch } from '../switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { Tabs, TabsList, TabsTrigger } from '../tabs';
import { Textarea } from '../textarea';
import { Toggle } from '../toggle';
import { designSystemComponents } from './design-system-utils';

export const DesignSystemOverview = () => {
  const renderComponentVariations = (componentName: string): React.ReactNode[] => {
    switch (componentName) {
      case 'Button':
        return [
          <Button key="default">Default</Button>,
          <Button key="secondary" variant="secondary">Secondary</Button>,
          <Button key="outline" variant="outline">Outline</Button>,
        ];
      case 'Input':
        return [
          <Input key="default" placeholder="Default" className="w-full" />,
          <Input key="error" placeholder="With error" className="w-full border-destructive" />,
          <Input key="disabled" placeholder="Disabled" className="w-full" disabled />,
        ];
      case 'Textarea':
        return [
          <Textarea key="default" placeholder="Default" rows={3} className="w-full" />,
          <Textarea key="error" placeholder="With error" rows={3} className="w-full border-destructive" />,
          <Textarea key="disabled" placeholder="Disabled" rows={3} className="w-full" disabled />,
        ];
      case 'Checkbox':
        return [
          <Checkbox key="unchecked" />,
          <Checkbox key="checked" defaultChecked />,
          <Checkbox key="disabled" disabled />,
        ];
      case 'Switch':
        return [
          <Switch key="unchecked" />,
          <Switch key="checked" defaultChecked />,
          <Switch key="disabled" disabled />,
        ];
      case 'Radio Group':
        return [
          <div key="vertical">
            <RadioGroup defaultValue="1">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="1" id="r1" />
                <Label htmlFor="r1">Option 1</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="2" id="r2" />
                <Label htmlFor="r2">Option 2</Label>
              </div>
            </RadioGroup>
          </div>,
          <div key="horizontal">
            <RadioGroup defaultValue="1" className="flex-row gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="1" id="r3" />
                <Label htmlFor="r3">Horizontal 1</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="2" id="r4" />
                <Label htmlFor="r4">Horizontal 2</Label>
              </div>
            </RadioGroup>
          </div>,
        ];
      case 'Select':
        return [
          <Select key="empty">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
          </Select>,
          <Select key="with-value">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="With value" />
            </SelectTrigger>
          </Select>,
          <Select key="disabled" disabled>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Disabled" />
            </SelectTrigger>
          </Select>,
        ];
      case 'Alert':
        return [
          <Alert key="info" variant="info">
            Information alert message
          </Alert>,
          <Alert key="warning" variant="warning">
            Warning alert message
          </Alert>,
        ];
      case 'Spinner':
        return [
          <Spinner key="default" />,
          <Spinner key="large" size="lg" />,
        ];
      case 'Skeleton':
        return [
          <div key="short" className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>,
          <div key="long" className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>,
        ];
      case 'Card':
        return [
          <Card key="default" className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Default Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">A simple card component with header and content sections.</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Learn More</Button>
              </div>
            </CardContent>
          </Card>,
          <Card key="image" className="w-full border-primary">
            <CardHeader>
              <div className="w-full h-32 rounded-md bg-muted/50 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop" alt="Card" className="w-full h-full object-cover" />
              </div>
              <CardTitle className="text-lg mt-3">Image Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Card with hero image and descriptive content.</p>
              <div className="flex gap-2">
                <Button size="sm">Action</Button>
                <Button variant="outline" size="sm">Cancel</Button>
              </div>
            </CardContent>
          </Card>,
          <Card key="gradient" className="w-full bg-linear-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img" aria-labelledby="lightning-icon">
                    <title id="lightning-icon">Lightning bolt icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Featured Item</h3>
                  <p className="text-sm text-muted-foreground">Elevated card style with gradient background and custom icon.</p>
                </div>
              </div>
            </CardContent>
          </Card>,
        ];
      case 'Badge':
        return [
          <Badge key="default">Default</Badge>,
          <Badge key="secondary" variant="secondary">Secondary</Badge>,
          <Badge key="outline" variant="outline">Outline</Badge>,
        ];
      case 'Avatar':
        return [
          <Avatar key="fallback">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>,
          <Avatar key="image">
            <AvatarImage src="https://i.pravatar.cc/400?img=36" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>,
          <Avatar key="ring" className="ring-2 ring-primary">
            <AvatarImage src="https://i.pravatar.cc/400?img=68" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>,
        ];
      case 'Table':
        return [
          <div key="default">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell><Badge>Active</Badge></TableCell>
                  <TableCell>2024-01-15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell><Badge variant="secondary">Inactive</Badge></TableCell>
                  <TableCell>2024-01-16</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>,
        ];
      case 'Breadcrumbs':
        return [
          <Breadcrumbs key="products" items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/' }, { label: 'Details' }]} />,
          <Breadcrumbs key="settings" items={[{ label: 'Dashboard', href: '/' }, { label: 'Settings', href: '/' }, { label: 'Profile' }]} />,
        ];
      case 'Tabs':
        return [
          <Tabs key="two-tabs" defaultValue="1" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="1">Tab 1</TabsTrigger>
              <TabsTrigger value="2">Tab 2</TabsTrigger>
            </TabsList>
          </Tabs>,
          <Tabs key="three-tabs" defaultValue="1" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="1">Overview</TabsTrigger>
              <TabsTrigger value="2">Details</TabsTrigger>
              <TabsTrigger value="3">Settings</TabsTrigger>
            </TabsList>
          </Tabs>,
        ];
      case 'Accordion':
        return [
          <Accordion key="single" type="single" className="w-full">
            <AccordionItem value="1">
              <AccordionTrigger>Section 1</AccordionTrigger>
              <AccordionContent>Content for section 1</AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionTrigger>Section 2</AccordionTrigger>
              <AccordionContent>Content for section 2</AccordionContent>
            </AccordionItem>
          </Accordion>,
          <Accordion key="multiple" type="multiple" className="w-full">
            <AccordionItem value="1">
              <AccordionTrigger>Expandable 1</AccordionTrigger>
              <AccordionContent>Multiple sections can be open</AccordionContent>
            </AccordionItem>
          </Accordion>,
        ];
      case 'Progress':
        return [
          <div key="progress-bars" className="space-y-2 w-full">
            <Progress value={33} />
            <Progress value={66} />
            <Progress value={100} />
          </div>,
        ];
      case 'Slider':
        return [
          <div key="sliders" className="space-y-4 w-full">
            <Slider defaultValue={[50]} />
            <Slider defaultValue={[25, 75]} />
            <Slider defaultValue={[40]} disabled />
          </div>,
        ];
      case 'Toggle':
        return [
          <Toggle key="default">Default</Toggle>,
          <Toggle key="outline" variant="outline">Outline</Toggle>,
          <Toggle key="pressed" pressed>Pressed</Toggle>,
        ];
      default:
        return [<span key="preview" className="text-sm text-muted-foreground">Preview</span>];
    }
  };

  const getGridClass = (componentName: string): string => {
    const gridMap: Record<string, string> = {
      'Button': 'col-span-1 md:col-span-2',
      'Input': 'col-span-1 md:col-span-2',
      'Textarea': 'col-span-1 md:col-span-2',
      'Checkbox': 'col-span-1',
      'Switch': 'col-span-1',
      'Radio Group': 'col-span-1 md:col-span-2',
      'Select': 'col-span-1 md:col-span-2',
      'Alert': 'col-span-1 md:col-span-3 lg:col-span-4',
      'Spinner': 'col-span-1',
      'Skeleton': 'col-span-1 md:col-span-2',
      'Card': 'col-span-1 md:col-span-2 lg:col-span-3',
      'Badge': 'col-span-1',
      'Avatar': 'col-span-1',
      'Table': 'col-span-1 md:col-span-3 lg:col-span-4',
      'Breadcrumbs': 'col-span-1 md:col-span-3 lg:col-span-4',
      'Tabs': 'col-span-1 md:col-span-2 lg:col-span-3',
      'Accordion': 'col-span-1 md:col-span-2 lg:col-span-3',
      'Progress': 'col-span-1 md:col-span-2 lg:col-span-3',
      'Slider': 'col-span-1 md:col-span-2 lg:col-span-3',
      'Toggle': 'col-span-1 md:col-span-2',
    };
    return gridMap[componentName] || 'col-span-1';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {designSystemComponents.map((component) => (
          <div
            key={component.name}
            className={`${getGridClass(component.name)} p-6 border border-border/50 bg-background`}
          >
            <div className="space-y-4">
              {renderComponentVariations(component.name).map((variation, idx) => (
                <div key={idx} className="flex items-center justify-center">
                  {variation}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
