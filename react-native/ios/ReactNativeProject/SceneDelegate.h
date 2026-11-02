#import <UIKit/UIKit.h>

// Apps built with the iOS 27 SDK must use the UIScene life cycle, otherwise they do not launch.
// React Native 0.74 creates its window in the app delegate; this moves it into the scene.
@interface SceneDelegate : UIResponder <UIWindowSceneDelegate>
@property (nonatomic, strong) UIWindow *window;
@end
