#import "SceneDelegate.h"
#import "AppDelegate.h"
#import <React/RCTLinkingManager.h>

@implementation SceneDelegate

- (void)scene:(UIScene *)scene willConnectToSession:(UISceneSession *)session options:(UISceneConnectionOptions *)connectionOptions {
  if (![scene isKindOfClass:[UIWindowScene class]]) { return; }
  AppDelegate *app = (AppDelegate *)UIApplication.sharedApplication.delegate;
  UIViewController *root = app.window.rootViewController;
  app.window.rootViewController = nil;

  UIWindow *window = [[UIWindow alloc] initWithWindowScene:(UIWindowScene *)scene];
  window.rootViewController = root;
  self.window = window;
  app.window = window;
  [window makeKeyAndVisible];

  NSURL *url = connectionOptions.URLContexts.anyObject.URL;
  if (url) { [RCTLinkingManager application:UIApplication.sharedApplication openURL:url options:@{}]; }
}

- (void)scene:(UIScene *)scene openURLContexts:(NSSet<UIOpenURLContext *> *)URLContexts {
  NSURL *url = URLContexts.anyObject.URL;
  if (url) { [RCTLinkingManager application:UIApplication.sharedApplication openURL:url options:@{}]; }
}

@end
