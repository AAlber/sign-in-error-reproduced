import { useTranslation } from "react-i18next";
import {
  createPeerFeedback,
  updatePeerFeedback,
} from "@/src/client-functions/client-peer-feedback";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import useUser from "@/src/zustand/user";
import Form from "../../reusable/formlayout";
import { Button } from "../../reusable/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../reusable/shadcn-ui/dialog";
import { Textarea } from "../../reusable/shadcn-ui/text-area";
import Stars from "../content-blocks/feedback/stars";
import useCourse from "../zustand";
import usePeerFeedbackStore from "./zustand";

const PeerFeedbackDialog = () => {
  const {
    isOpen,
    setIsOpen,
    data,
    setData,
    userWithPeerFeedback,
    rating,
    setRating,
    feedback,
    setFeedback,
    loading,
    setLoading,
  } = usePeerFeedbackStore();
  const { user } = useUser();
  const { course } = useCourse();
  const { t } = useTranslation("page");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {replaceVariablesInString(t("leave_feedback"), [
              userWithPeerFeedback?.name ?? "",
            ])}
          </DialogTitle>
          <DialogDescription className="mb-2 text-muted-contrast">
            {t("can_edit_feedback_later_desc")}
          </DialogDescription>{" "}
        </DialogHeader>
        <Form>
          <Form.Item label="Feedback">
            <Stars score={rating} onClick={(n) => setRating(n + 1)} />
          </Form.Item>
          <Form.FullWidthItem>
            <Textarea
              className="h-24 w-full"
              placeholder={t("write_feedback")}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={500}
            />
          </Form.FullWidthItem>
          <Form.ButtonSection>
            <Button onClick={() => setIsOpen(false)} variant={"ghost"}>
              {t("general.cancel")}
            </Button>
            <Button
              disabled={rating === 0 || loading}
              onClick={async () => {
                if (!course || !course.layer_id || !userWithPeerFeedback)
                  return;

                setLoading(true);
                await createPeerFeedback(
                  userWithPeerFeedback.id,
                  course.layer_id,
                  feedback,
                  rating,
                );

                updatePeerFeedback(
                  data,
                  userWithPeerFeedback,
                  user,
                  feedback,
                  rating,
                  setData,
                  setIsOpen,
                  setLoading,
                );
              }}
              variant={"cta"}
            >
              {t(loading ? "general.loading" : "general.save")}
            </Button>
          </Form.ButtonSection>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PeerFeedbackDialog;
