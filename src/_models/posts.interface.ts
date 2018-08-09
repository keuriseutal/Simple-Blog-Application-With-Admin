
export interface Post{
    id: number;
    status: string; 
    /*
    When post is created by the user: Pending
    When the post is approved by the admin: Approved
    When the post is returned by the admin: Returned
    */
    title: string;
    subtitle?: string;
    author: string;
    category: string;
    date: string;
    body: string;
    isDraft: boolean;
}
