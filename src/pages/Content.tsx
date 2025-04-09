
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Eye, Pencil, Trash, FileText, Import, Rss, FileArchive, Archive, Rows, ThumbsUp } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Sample content categories data
const contentCategories = [
  { 
    id: '1', 
    name: 'Content without a category',
    description: 'Content that hasn\'t been saved in a category.',
    active: true,
    postsCount: 0
  },
  { 
    id: '2', 
    name: 'Curated',
    description: 'Add 3rd party content you find, or connect some RSS Feeds. This content shows you know your stuff.',
    active: true,
    postsCount: 0
  },
  { 
    id: '3', 
    name: 'Engaging Posts',
    description: 'Posts that help generate engagement on you socials. Share inspirational or fun quotes from your industry.',
    active: true,
    postsCount: 0
  },
  { 
    id: '4', 
    name: 'Our Blogs and Videos',
    description: 'Share your own content - any blog posts (you can even connect them via RSS) you publish.',
    active: true,
    postsCount: 0
  },
  { 
    id: '5', 
    name: 'Promotional',
    description: 'Use this category to promote your services/products. Make sure to include Calls To Action.',
    active: true,
    postsCount: 0
  }
];

// Content tab components
interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    active: boolean;
    postsCount: number;
  };
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{category.name}</CardTitle>
          <Button variant="ghost" size="sm">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Active</span>
          <Switch checked={category.active} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" className="flex-1 mr-1 flex items-center justify-center">
          <Eye className="h-4 w-4 mr-1" />
          <span>View Posts ({category.postsCount})</span>
        </Button>
        <Button variant="outline" className="flex-1 ml-1 flex items-center justify-center">
          <Pencil className="h-4 w-4 mr-1" />
          <span>Edit Category</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

const Content: React.FC = () => {
  const [activeTab, setActiveTab] = useState('categories');

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Content Management</h1>
          <p className="text-muted-foreground">Organize, create, and manage your social media content</p>
        </div>
        <Button className="flex items-center" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Category
        </Button>
      </div>
      
      <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="categories" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="hashtag" className="flex items-center">
              <span className="font-semibold text-lg mr-1">#</span>
              <span>Hashtag Collection</span>
            </TabsTrigger>
            <TabsTrigger value="import-csv" className="flex items-center">
              <Import className="h-4 w-4 mr-2" />
              <span>Import CSV</span>
            </TabsTrigger>
            <TabsTrigger value="import-links" className="flex items-center">
              <Import className="h-4 w-4 mr-2" />
              <span>Import Links</span>
            </TabsTrigger>
            <TabsTrigger value="import-media" className="flex items-center">
              <Import className="h-4 w-4 mr-2" />
              <span>Import Media</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Your content categories</h2>
            <p className="text-muted-foreground">Content is king! And you'll feel the same once you start adding it to your categories.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="hashtag" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hashtag Collection</CardTitle>
              <CardDescription>Organize and manage your hashtag groups for easy access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">New Hashtag Group</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Group name" className="flex-1" />
                    <Button>Create</Button>
                  </div>
                </div>
                <div className="border rounded-lg p-4 text-center text-muted-foreground">
                  <p>You don't have any hashtag groups yet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import-csv" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import CSV</CardTitle>
              <CardDescription>Import posts in bulk from a CSV file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileArchive className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Drag and drop your CSV file here or</p>
                <Button className="mt-4">Browse Files</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import-links">
          <Card>
            <CardHeader>
              <CardTitle>Import links</CardTitle>
              <CardDescription>Turn a dozen links into a dozen posts by quickly importing them to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Please choose the social profiles you want to share on.</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">Select All</Button>
                  <Button variant="outline" size="sm">Select None</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <Button className="w-full flex items-center justify-center" variant="secondary">
                  <Import className="mr-2 h-4 w-4" />
                  Import links
                </Button>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Links (one per line)</p>
                    <Textarea placeholder="Paste your links here, one per line" className="h-40" />
                  </div>
                </div>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Category</p>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Append Text</p>
                    <Input placeholder="Append text" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import-media">
          <Card>
            <CardHeader>
              <CardTitle>Import Media</CardTitle>
              <CardDescription>Bulk upload images and videos for your social media posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Archive className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Drag and drop media files here or</p>
                <Button className="mt-4">Browse Files</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Content;
